import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './index.css';
import App from './app';
import Recipe from './recipe';
import RegisterForm from "./registerForm";
import LoginForm from "./loginForm";
import * as serviceWorker from './serviceWorker';
const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

const Application = () => {
    const [ loginVisible, setLoginVisible ] = React.useState(false);
    const [ registerVisible, setRegisterVisible ] = React.useState(false);
    const [ user, setUser ] = React.useState( { email: "" } );
    const [ token, setToken ] = React.useState( null );

    const handleLoginClose = () => {
        setLoginVisible( false );
    }

    const handleRegisterClose = () => {
        setRegisterVisible( false );
    }

    React.useEffect( () => {
        const token = localStorage.getItem( "token" );

        if (token) {
            const url = `${baseUrl}/api/users`;
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
            };

            const handleSuccess = (res) => {
                setUser( res.user );
                setToken( token );
            }

            const handleError = ( err ) => {
                localStorage.removeItem( "token" );
            }


            fetch( url, options )
                .then( res => {
                    let json = res.json(); // there's always a body
                    if (res.status >= 200 && res.status < 300) {
                        return json;
                    } else {
                        return json.then(Promise.reject.bind(Promise));
                    }
                } )
                .then( handleSuccess, handleError )
        }
    }, [] );

    const logOut = () => {
        localStorage.removeItem( "token" );
        window.location.reload();
    }

    return (
        <>
            {registerVisible && (<RegisterForm handleClose={ handleRegisterClose } />)}
            {loginVisible && (<LoginForm handleClose={ handleLoginClose }/>)}
            <div className="header">
                <Link to="/">Recipello</Link>
                {
                    !token && (
                        <div className="auth-actions">
                            <button type="button" onClick={ () => setLoginVisible( true ) }>Log In</button>
                            <button type="button" onClick={ () => setRegisterVisible( true ) }>Register</button>
                        </div>
                    )
                }
                {
                    token && (
                        <div className="auth-actions">
                            <span>Hello { user.email }</span>
                            <button type="button" onClick={ () => logOut() }>Log out</button>
                        </div>
                    )
                }
            </div>
            <Route path="/" component={ () => <App token={ token } user={ user } baseUrl={baseUrl} /> } exact/>
            <Route path="/r/:id" component={ () => <Recipe token={ token } user={ user } /> } baseUrl={baseUrl} exact token={ token } user={ user }/>
        </>
    )
}

ReactDOM.render((
    <Router>
        <Application />
    </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
