import React from "react";
import "./authforms.css";
import apiService from "../../helpers/apiService";

function RegisterForm() {
    const [ email, setEmail ] = React.useState("");
    const [ password, setPassword ] = React.useState("");

    const handleOnSubmit = (evt) => {
        evt.preventDefault();

        const newUser = {
            email,
            password,
        }

        const handleSuccess = ( res ) => {
            console.log(res);
        }

        const handleError = (err) => {
            console.log(err);
        }

        apiService({
            path: `/api/users`,
            method: "POST",
            body: newUser,
        }).then( handleSuccess, handleError );
    }

    return (
        <>
            <div className="overlay"></div>
            <form className="form register-form" onSubmit={ handleOnSubmit }>
                <h1>Register New Account</h1>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" required defaultValue={ email } onChange={ evt => setEmail( evt.target.value ) } />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" required defaultValue={ password } onChange={ evt => setPassword( evt.target.value ) }/>
                </div>
                <div className="form-actions">
                    <button type="submit" className="button button-primary">Create Account</button>
                </div>
            </form>
        </>
    )
}

export default RegisterForm;
