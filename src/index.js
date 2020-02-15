import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './index.css';
import App from './app';
import Recipe from './recipe';
import RegisterForm from "./registerForm";
import LoginForm from "./loginForm";
import apiService from "./apiService";
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
        const handleSuccess = (res) => {
            setUser( res.user );
            setToken( localStorage.getItem( "token" ) );
        }

        const handleError = ( err ) => {
            localStorage.removeItem( "token" );
        }

        apiService( {
            path: "/api/users"
        } ).then( handleSuccess, handleError );
    }, [token] );

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
