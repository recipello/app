import React from "react";
import "./authforms.css";
import apiService from "../../helpers/apiService";

function LoginForm(props) {
    const { handleClose } = props;
    const [ email, setEmail ] = React.useState("");
    const [ password, setPassword ] = React.useState("");

    const getUser = () => {
        console.log("here");
        const handleSuccess = (res) => {
            window.location.reload();
        }

        const handleError = ( err ) => {
            console.log(err);
        }

        apiService( { path: "/api/users"} ).then( handleSuccess, handleError );
    }

    const handleOnSubmit = (evt) => {
        evt.preventDefault();

        const newUser = {
            email,
            password,
        }

        const handleSuccess = ( res ) => {
            const { token } = res;
            localStorage.setItem( "token", token );
            getUser();
        }

        const handleError = () => {

        }

        apiService( {
            path: "/api/login",
            method: "POST",
            body: newUser
        } ).then( handleSuccess, handleError );
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
