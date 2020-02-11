import React from "react";
import "./authforms.css";
const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

function LoginForm(props) {
    const { handleClose } = props;
    const [ email, setEmail ] = React.useState("");
    const [ password, setPassword ] = React.useState("");
    const getUser = () => {
        const url = `${baseUrl}/api/users`;
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem( "token" )
            },
        };

        const handleSuccess = (res) => {
            window.location.reload();
        }

        const handleError = ( err ) => {
            console.log(err);
        }


        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    const handleOnSubmit = (evt) => {
        evt.preventDefault();
        const url = `${baseUrl}/api/login`;
        const newUser = {
            email,
            password,
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( newUser ),
        };

        const handleSuccess = ( res ) => {
            const { token } = res;
            localStorage.setItem( "token", token );
            getUser();
        }

        const handleError = () => {

        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    return (
        <>
            <div className="overlay"></div>
            <form className="form register-form" onSubmit={ handleOnSubmit }>
                <div className="form-header">
                    <h1>Login</h1>
                    <button type="button" className="close" onClick={ handleClose }>&times;</button>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" required defaultValue={ email } onChange={ evt => setEmail( evt.target.value ) } />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" required defaultValue={ password } onChange={ evt => setPassword( evt.target.value ) }/>
                </div>
                <div className="form-actions">
                    <button className="button button-outlined" onClick={ handleClose } type="button">Cancel</button>
                    <button type="submit" className="button button-primary">Login</button>
                </div>
            </form>
        </>
    )
}

export default LoginForm;
