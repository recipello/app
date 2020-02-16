import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';

import App from './pages/app';
import Recipe from './pages/recipe';
import RegisterForm from "./components/forms/registerForm";
import LoginForm from "./components/forms/loginForm";
import apiService from "./helpers/apiService";
import * as serviceWorker from './serviceWorker';

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
            <GlobalStyle />
            {registerVisible && (<RegisterForm handleClose={ handleRegisterClose } />)}
            {loginVisible && (<LoginForm handleClose={ handleLoginClose }/>)}
            <Header>
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
            </Header>
            <Route path="/" component={ () => <App token={ token } user={ user } /> } exact />
            <Route path="/r/:id" component={ () => <Recipe token={ token } user={ user } /> } exact />
        </>
    )
}

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }

    .lato {
        font-family: 'Lato', sans-serif;
    }

    .open-sans {
        font-family: 'Open Sans', sans-serif;
    }

    * {
        box-sizing: border-box;
    }

    html,
    body,
    #root {
        height: 100%;
    }

    body {
        margin: 0;
        font-family: 'Open Sans', sans-serif;
        background: #F7F7F8;
    }

    #root {
        display: flex;
        flex-direction: column;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    background: #333;
    align-items: center;
    min-height: 52px;

    a {
        font-family: "Lato";
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 4px;
    }

    a,
    button,
    span {
        color: #fff;
        padding: 10px;
        font-size: 18px;
        text-decoration: none;
        cursor: pointer;
    }

    button {
        background: transparent;
        margin: 0 0 0 20px;
        border: none;
        padding: 5px 10px;
        font-size: 18px;
    }

    button:hover {
        background: #fff;
        color: #333;
    }

    .personal-space {
        color: #fff;
    }


    .auth-actions button {
        font-size: 13px;
    }

    @media only screen and (min-width: 600px) {
        .auth-actions button {
            font-size: 18px;
        }
    }
`;

ReactDOM.render((
    <Router>
        <Application />
    </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
