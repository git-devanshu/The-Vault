import React, { useState } from "react";
import "../styles/Login.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL, saveAuthToken} from '../utils/helperFunctions';

const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email : '',
        password : ''
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUser({
            ...user,
            [name] : value
        });
    }

    const loginUser = (e) =>{
        e.preventDefault();
        if(!e.target.form.reportValidity()){
            return;
        }
        const toastId = toast.loading('Loading...');
        axios.post(getBaseURL() + '/auth/login', user)
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                saveAuthToken(res.data.token);
                setTimeout(()=>{
                    navigate('/');
                }, 1500);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="app-title">The Vault</h1>
                <h2 className="login-heading">Welcome Back</h2>
                <form className="login-form">
                    <label className="login-label">Email</label>
                    <input type="email" name='email' value={user.email} onChange={handleChange} required className="login-input" />
                    
                    <label className="login-label">Password</label>
                    <input type="password" name='password' value={user.password} onChange={handleChange} required minLength={8} maxLength={30} className="login-input" />
                    
                    <a href="/reset-password" className="forgot-password">
                        Forgot Password?
                    </a>

                    <button type="submit" onClick={loginUser} className="login-button">
                        Login
                    </button>
                </form>
                <p className="signup-text">
                    New User? <a href="/signup" className="signup-link">Signup</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
