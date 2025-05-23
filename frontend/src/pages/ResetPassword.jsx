import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../styles/Login.css";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [vfcode, setVfcode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');   

    const [showVerification, setShowVerification] = useState(false); //to show pin input
    const [showResetFields, setShowResetFields] = useState(false); //to show new password field

    const getQueryParams = (query) =>{
        return query.substring(1).split('&')
            .reduce((params, param) =>{
                const [key, value] = param.split('=');
                params[key] = value;
                return params;
            }, {});
    };

    // for managing the reset password flow using url parameters
    useEffect(()=>{
        const queryParams = getQueryParams(location.search);
        if(queryParams.code === "true"){
            setShowVerification(true);
            setEmail(queryParams.email);
        }
        else if(queryParams.new_password === "true"){
            setShowVerification(true);
            setShowResetFields(true);
            setEmail(queryParams.email);
            setVfcode(queryParams.vfcode);
        }
    }, [navigate, location]);

    const verifyUser = (e) =>{
        e.preventDefault();
        if(!e.target.form.reportValidity()){
            return;
        }
        const toastId = toast.loading('Verifying email...');
        axios.post(getBaseURL() + '/auth/get-vfcode', {email})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate(`/reset-password?code=true&email=${email}`);
                }, 300);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    const verifyCode = (e) =>{
        e.preventDefault();
        if(!e.target.form.reportValidity()){
            return;
        }
        if(vfcode.length < 6){
            toast.error('Enter all 6 digits');
            return;
        }
        const toastId = toast.loading('Verifying Code...');
        axios.post(getBaseURL() + '/auth/verify-vfcode', {vfcode, email})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate(`/reset-password?new_password=true&email=${email}&vfcode=${vfcode}`);
                }, 300);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    const resetPassword = (e) =>{
        e.preventDefault();
        if(!e.target.form.reportValidity()){
            return;
        }
        else if(newPassword !== confirmPassword){
            toast.error('Enter the same password');
            return;
        }
        const toastId = toast.loading('Loading...');
        axios.post(getBaseURL() + '/auth/reset-password', {newPassword, email, vfcode})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate('/')
                }, 1000);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="app-title">The Vault</h1>

                {!showVerification ? (
                    <form className="login-form">
                        <h2 className="login-heading">Forgot Password?</h2>
                        <h2 style={{fontSize: '16px', fontWeight: 300, textAlign: 'center', marginTop: '0', marginBottom: '10px'}}>Enter the email address of your account.</h2>
                        
                        <label className="login-label">Email</label>
                        <input type="email" name='email' value={email} onChange={(e)=> setEmail(e.target.value)} required className="login-input" />
                        
                        <button type="submit" onClick={verifyUser} className="login-button">
                            Send Verification Code
                        </button>
                    </form>) : !showResetFields ? (

                    <form className="login-form">
                        <h2 className="login-heading">Verify User</h2>
                        <h2 style={{fontSize: '16px', fontWeight: 300, textAlign: 'center', marginTop: '0', marginBottom: '10px'}}>Enter the 6 digit verification code sent to {email}.</h2>

                        <label className="login-label">Verification Code</label>
                        <div style={{display: 'grid', placeItems: 'center', marginTop: '10px', marginBottom: '10px'}}>
                            <HStack>
                                <PinInput type="number" value={vfcode} onChange={(value) => setVfcode(value)}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </div>

                        <button type="submit" onClick={verifyCode} className="login-button">
                            Verify
                        </button>
                    </form>) : (

                    <form className="login-form">
                        <h2 className="login-heading">Reset Password</h2>
                        <h2 style={{fontSize: '16px', fontWeight: 300, textAlign: 'center', marginTop: '0', marginBottom: '10px'}}>Set the new password for your account.</h2>

                        <label className="login-label">New Password</label>
                        <input type="password" name='password' value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} required minLength={8} maxLength={30} className="login-input" />
                        
                        <label className="login-label">Retype New Password</label>
                        <input type="password" name='password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required minLength={8} maxLength={30} className="login-input" />
                        
                        <button type="submit" onClick={resetPassword} className="login-button">
                            Reset Password
                        </button>
                    </form>)
                }

                <p className="signup-text">
                    Try Login? <a href="/login" className="signup-link">Login</a>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
