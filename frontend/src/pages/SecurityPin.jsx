import React, { useState } from "react";
import "../styles/Login.css";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';
import {getAuthToken, getBaseURL} from '../utils/helperFunctions';

export default function SecurityPin() {
    const navigate = useNavigate();

    const [securityPin, setSecurityPin] = useState('');
    const [password, setPassword] = useState('');

    const resetSecurityPin = (e) =>{
        e.preventDefault();
        if(!e.target.form.reportValidity()){
            return;
        }
        if(securityPin.length != 6){
            toast.error('All 6 digits are required');
            return;
        }
        const toastId = toast.loading('Loading...');
        const token = getAuthToken();
        axios.post(getBaseURL()+'/auth/reset-security-pin', {securityPin, password}, {headers : {
            Authorization : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate('/')
                }, 2000);
            }
            else{
                toast.error(res.data.message, {id :toastId});
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
                <div>
                    <h2 className="login-heading">Reset Security Pin</h2>
                    <h2 style={{fontSize: '16px', fontWeight: 300, textAlign: 'center', marginTop: '0', marginBottom: '10px'}}>This pin is required to access all your passwords and saved data.</h2>
                </div>

                <form className="login-form">
                    <label className="login-label">Password</label>
                    <input type="password" name='password' value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={8} maxLength={30} className="login-input" />
                    
                    <label className="login-label">New Security Pin</label>
                    <div style={{display: 'grid', placeItems: 'center', marginTop: '10px', marginBottom: '10px'}}>
                        <HStack>
                            <PinInput type="number" value={securityPin} onChange={(value) => setSecurityPin(value)}>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>
                    </div>
                    <button type="submit" onClick={resetSecurityPin} className="login-button">
                        Confirm
                    </button>
                </form>
            </div>
        </div>
    );
};
