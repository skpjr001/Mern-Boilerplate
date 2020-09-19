import { Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Joi from '@hapi/joi'
import { useHistory } from 'react-router-dom'
import './style.css'
import { apiCall } from '../utilities'

function Register() {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
      
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }
    

    // Validation Parameters
    const schema =Joi.object().keys({
    email: Joi.string().alphanum().min(4).max(30).required(),
    password: Joi.string().trim().min(8).max(50).required(),
    confirmPassword: Joi.ref('password')
    });

    //User Validation
    const isValidUser = () => {
        const result = schema.validate({email,password,confirmPassword});
        if(result.error == null) return true
        if (result.error.message.includes('email')) {
            alert("Email is invalid.❌");
        } else {
            alert("Password is invalid.❌"); 
        }
        return false;
    }

    // User Registration Handler
    async function handleUserRegistration(e) {
        const Register_URL = '/auth/register';
        e.preventDefault(); // prevent refresh of page to keep user entered details
        if(isValidUser()){
            const res = await apiCall(Register_URL, {email, password})

            //console.log(res);

            if(res.status === 'ok') {
                //TODO : tokens => refresh tokens
                //TODO : localstorage => memory
                localStorage.setItem('token', res.data)
                //data.isLoading=false;          
                alert(`Your account is created successfully.✅`);
                //props.prop(); // for login state
                //alert(res.message)
                history.push('/dashboard');
            }else {
                alert("Error ❌",res.message)
            }
      
        }
    }

    return (
        <div className="form">
            <h1>Register</h1>
            <form className="register-fields">
            <TextField
            value={email}
            onChange={handleEmailChange}
            placeholder="you@awesome.com"
            label="Email"
            variant="outlined"
            type="text"
            autoFocus
            fullWidth
            required
            ></TextField>

            <TextField
            value={password}
            onChange={handlePasswordChange}
            placeholder="Your Password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            ></TextField>

            <TextField
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm Your Password"
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            ></TextField>

            <Button
            variant="contained"
            color="primary"
            onClick={handleUserRegistration}
            type="submit"
            fullWidth
            >Register</Button>
            </form>
        </div>
    )
}

export default Register
