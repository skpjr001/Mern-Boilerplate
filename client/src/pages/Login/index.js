import { Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Joi from '@hapi/joi'
import './style.css'
import { apiCall } from '../utilities';

function Login() {

    const history = useHistory();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
    }

    // Validation Parameters
    const schema =Joi.object().keys({
        email: Joi.string().alphanum().min(4).max(30).required(),
        password: Joi.string().trim().min(8).max(50).required()
    });

    // User Validation
    const validUser = () => {
		const result = schema.validate({email,password});
        if(result.error == null) return true
        if(result.error.message.includes('email')){
            console.log(result,email,password)
            alert('Email is invalid. ❌');
        } else {
            alert('Password is invalid. ❌');
		}
		return false;
	}
    

    // function handleUserLogin() {
    //     console.log("user logged In")
    // }

    async function handleUserLogin(e) {
		const SIGNIN_URL = '/auth/login';
		e.preventDefault(); // prevent refresh of page to keep user entered details
		if(validUser()){
			
			const res = await apiCall(SIGNIN_URL, {email, password})
            
            //console.log(res);

			if(res.status === 'ok') {
                //TODO : tokens => refresh tokens
                //TODO : localstorage => memory
                // user logged in successfully
				localStorage.setItem('token', res.data);
				alert('You are successfully signed In. ✅');
				//props.prop(); // for login state
				history.push('/dashboard');
			}else {
				// user did not logged in error
				alert(`Error ❌ ${res.message}`);
			}
		}
	}


    return (
        <div className="form">
            <h1>Login</h1>
            <form className="login-fields">
            <TextField
                placeholder="you@awesome.com"
                label="Email"
                variant="outlined"
                onChange={handleEmailChange}
                fullWidth
                autoFocus
                required
            ></TextField>

            <TextField
                placeholder="Your Password"
                label="Password"
                variant="outlined"
                onChange={handlePasswordChange}
                type="password"
                fullWidth
                required
            ></TextField>

            <Button
                variant="contained"
                color="primary"
                onClick={handleUserLogin}
                fullWidth
                type="submit"
            >Login</Button>
            </form>
        </div>
    )
}

export default Login
