import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const Signup = () => {
    const navigate = useNavigate();

    const [showPinPage, setShowPinPage] = useState(false);
    const [user, setUser] = useState({
        email : '',
        name : '',
        password : '',
        securityPin : ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUser({
            ...user,
            [name] : value
        });
    }

    const goToNextPage = (e) =>{
        e.preventDefault();
        if(!e.target.form.reportValidity()){
            return;
        }
        setShowPinPage(true);
    }

    const registerUser = (e) =>{
        e.preventDefault();
        if(!e.target.form.reportValidity()){
            return;
        }
        const toastId = toast.loading('Loading...');
        setIsLoading(true);
        axios.post(getBaseURL() + '/auth/signup', user)
        .then(res =>{
            if(res.status === 201){
                toast.success(res.data.message, {id : toastId});
                setTimeout(()=>{
                    navigate('/login');
                }, 1500);
            }
            setIsLoading(false);
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
            setIsLoading(false);
        });
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="app-title">The Vault</h1>
                {!showPinPage && (
                    <form className="login-form">
                        <h2 className="login-heading">Signup</h2>

                        <label className="login-label">Email</label>
                        <input type="email" name='email' value={user.email} onChange={handleChange} required className="login-input" />
                        
                        <label className="login-label">Name</label>
                        <input type="text" name='name' value={user.name} onChange={handleChange} required className="login-input" />
                        
                        <label className="login-label">Password</label>
                        <input type="password" name='password' value={user.password} onChange={handleChange} required minLength={8} maxLength={30} className="login-input" />
                        
                        <button onClick={goToNextPage} className="login-button">
                            Next
                        </button>
                    </form>
                )}
                {showPinPage && (
                    <form className="login-form">
                        <h2 className="login-heading">Set Your Security Pin</h2>
                        <h2 style={{fontSize: '16px', fontWeight: 300, textAlign: 'center', marginTop: '0'}}>This pin is required to access all your passwords and saved data.</h2>

                        <label className="login-label">Security Pin</label>
                        <div style={{display: 'grid', placeItems: 'center', marginTop: '10px', marginBottom: '10px'}}>
                            <HStack>
                                <PinInput type="number" value={user.securityPin} onChange={(value) => setUser({...user, securityPin : value})}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </div>

                        <button disabled={isLoading} type="submit" onClick={registerUser} className="login-button">
                            Signup
                        </button>
                    </form>
                )}
                <p className="signup-text">
                    Already registered? <a href="/login" className="signup-link">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
