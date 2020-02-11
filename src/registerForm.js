import React from "react";
import "./authforms.css";

function RegisterForm() {
    const [ email, setEmail ] = React.useState("");
    const [ password, setPassword ] = React.useState("");

    const handleOnSubmit = (evt) => {
        evt.preventDefault();
        const url = "http://localhost:3001/api/users";
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
            console.log(res);
        }

        const handleError = () => {

        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
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
