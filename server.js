const express = require( "express" );
const bodyParser = require( "body-parser" );
const path = require( "path" );
const multer = require( "multer" );
const sharp = require( "sharp" );
const basicAuth = require( "express-basic-auth" );
const Datastore = require( "nedb" );
const yup = require( "yup" );
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require( "./config" );
const saltRounds = 10;
const envDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const envProd = process.env.NODE_ENV === "production";
const publicFolder = envDev ? config.publicDev : config.publicProd;
const corsAllowOrigin = envDev ? "*" : config.publicUrl;
const port = envDev ? config.devPort : config.prodPort;
const host = envDev ? config.devIp : config.prodIp;

const recipeSchema = yup.object().shape( {
    name: yup.string().default( "the name of the recipe" ),
    description: yup.string().required(),
    coverPhoto: yup.string(),
    tags: yup.array().of( yup.string() ),
    steps: yup.array().of( yup.object().shape( {
        path: yup.string(),
        description: yup.string(),
    } ) ),
    createdOn: yup.date().default( function() {
        return new Date();
    } ),
} );

const usersSchema = yup.object().shape( {
    email: yup.string().email().required(),
    password: yup.string().required(),
    createdOn: yup.date().default( function() {
        return new Date();
    } ),
} );

const db = {};

db.recipes = new Datastore( {
    filename: path.join( __dirname, "/db/recipes.db" ),
    autoload: true,
} );

db.users = new Datastore( {
    filename: path.join( __dirname, "/db/users.db" ),
    autoload: true,
} );

const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, `${publicFolder}/images/uploads` );
    },
    filename: ( req, file, cb ) => {
        cb( null, `${ Date.now() }-${ file.originalname.split( " " ).join( "-" ) }` );
    },
} );

const upload = multer( { storage } );
const app = express();

app.use( ( req, res, next ) => {
    res.header( "Access-Control-Allow-Origin", corsAllowOrigin );
    res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token" );
    res.header( "Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, PATCH, DELETE" );

    next();
} );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
    limit: "50mb",
    extended: true,
} ) );

app.post( "/api/upload", auth, upload.single( "media" ), ( req, res ) => {
    const fileName = `resized-w600-${ req.file.filename }`;
    const imagePath = `images/uploads/${ fileName }`;

    sharp( req.file.path )
        .resize( { width: 600 } )
        .toFile( `${publicFolder}/${ imagePath }`, ( error ) => {
            if ( error ) {
                console.log( error );
                res.send( { message: "not ok" } );
                return;
            }

            res.send( {
                message: "ok",
                image: {
                    path: `/${ imagePath }`,
                },
            } );
        } );
} );

// recipes -----------------------------
app.post( "/api/recipes", auth, ( req, res ) => {
    recipeSchema.validate( req.body ).then( ( validData ) => {
        db.recipes.insert( {...validData, userId: req.user.userId}, ( err, doc ) => {
            if ( err ) {
                console.log( err );
                res.send( { message: "not ok" } );
                return;
            }

            res.send( {
                message: "ok",
                recipe: doc,
            } );
        } );
    } ).catch( );
} );

app.put( "/api/recipes/:id", auth, ( req, res ) => {
    const { id } = req.params;
    recipeSchema.validate( req.body ).then( ( validData ) => {
        db.recipes.update( {
            _id: id,
        }, {
            $set: {...validData, userId: req.user.userId},
        }, ( error, num ) => {
            if ( error ) {
                console.log( error );
                res.send( { message: "not ok" } );
                return;
            }

            db.recipes.findOne( { _id: id }, ( err, doc ) => {
                if ( err ) {
                    console.log( err );
                    res.send( { message: "not ok" } );
                    return;
                }

                res.send( {
                    message: "ok",
                    recipe: doc,
                } );
            } );
        } );
    } ).catch( );
} );

app.delete( "/api/recipes/:id", auth, ( req, res ) => {
    const { id } = req.params;
    db.recipes.remove( { _id: id }, (err, num) => {
        if ( err ) {
            console.log( err );
            res.send( { message: "not ok" } );
            return;
        }

        res.send( {
            message: "ok",
            num,
        } );
    } )
} );

app.get( "/api/recipes", ( req, res ) => {
    db.recipes.find( {}, ( err, recipes ) => {
        if ( err ) {
            console.log( err );
            res.send( { message: "not ok" } );
            return;
        }

        res.send( {
            message: "ok",
            recipes,
        } );
    } );
} );

app.get( "/api/recipes/:id", ( req, res ) => {
    db.recipes.findOne( {
        _id: req.params.id,
    }, ( err, recipe ) => {
        if ( err ) {
            console.log( err );
            res.send( { message: "not ok" } );
            return;
        }

        res.send( {
            message: "ok",
            recipe,
        } );
    } );
} );

// users -----------------------------
app.post( "/api/users", ( req, res ) => {
    usersSchema.validate( req.body ).then( ( validData ) => {
        db.users.findOne( { email: validData.email  }, (err, doc) => {
            if ( err ) {
                console.log( err );
                res.send( { message: "not ok" } );
                return;
            }

            if ( doc ) {
                res.status(500).send( { message: "email already taken" } );
                return;
            }

            bcrypt.genSalt( saltRounds, function(err, salt) {
                bcrypt.hash( validData.password, salt, function(bcryptError, hash) {
                    if ( bcryptError ) {
                        console.log( bcryptError );
                        res.send( { message: "not ok" } );
                        return;
                    }

                    db.users.insert( { email: validData.email, password: hash }, ( insertErr, doc ) => {
                        if ( insertErr ) {
                            console.log( insertErr );
                            res.send( { message: "not ok" } );
                            return;
                        }

                        const token = jwt.sign({ userId: doc._id }, 'shhhhh', { expiresIn: '24h' });

                        res.send( {
                            message: "ok",
                            token,
                        } );
                    } )
                });
            });
        } )
    } ).catch( );
} );

app.post( "/api/login", ( req, res ) => {
    usersSchema.validate( req.body ).then( ( validData ) => {
        console.log(validData);
        db.users.findOne( { email: validData.email  }, (err, doc) => {
            if ( err ) {
                console.log( err );
                res.send( { message: "not ok" } );
                return;
            }

            if ( !doc ) {
                res.status(500).send( { message: "no account found" } );
                return;
            }

            bcrypt.compare(validData.password, doc.password, function(bcryptError, result) {
                if ( bcryptError || !result ) {
                    res.status(500).send( { message: "there was a problem with the authentication." } );
                    return;
                }

                const token = jwt.sign({ userId: doc._id }, 'shhhhh', { expiresIn: '24h' });
                res.send( {
                    message: "ok",
                    token,
                } );
            });
        } );
    } );
} );

function auth ( req, res, next ) {
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res.status(401).send({
            message: "Access denied. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({message: "Invalid token."});
    }
}

app.get( "/api/users", auth, ( req, res ) => {
    db.users.findOne( { _id: req.user.userId }, { password: 0 }, (err, user) => {
        console.log(err);
        res.send( {
            message: "ok",
            user
        } )
    } );
} );

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

/*
get /api/users
get /api/users/:id
post /api/users
put /api/users/:id
delete /api/users/:id
*/

// app.use( "/", basicAuth( {
//     challenge: true,
//     users: { admin: "supersecret" },
// } ) );

app.use( "/", express.static( path.join( __dirname, publicFolder) ) );

app.listen( {
    port,
    host,
} );
