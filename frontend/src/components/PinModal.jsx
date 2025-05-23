import React, { useState } from 'react'
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import axios from 'axios';
import '../styles/PinModal.css';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getBaseURL, saveSecurityPin } from '../utils/helperFunctions';
import {toast} from 'react-hot-toast';

export default function PinModal() {
    const navigate = useNavigate();

    const [securityPin, setSecurityPin] = useState('');

    const navigateToHome = () =>{
        navigate('/');
    }

    const checkSecurityPin = () =>{
        if(securityPin.length != 6){
            toast.error('Enter all 6 digits');
            return;
        }
        const toastId = toast.loading('Loading...');
        const token = getAuthToken();
        axios.post(getBaseURL() + '/auth/check-security-pin', {securityPin}, {headers : {
            Authorization : `Bearer ${token}`
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                saveSecurityPin(securityPin);
                setTimeout(()=>{
                    window.location.reload();
                }, 1000);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }

    return (
        <div className='modal-container'>
            <div className='security-pin-modal'>
                <h2 className="login-heading">Enter Security Pin</h2>
                <h2 style={{fontSize: '16px', fontWeight: 300, textAlign: 'center', marginTop: '0', marginBottom: '10px'}}>You need to enter your 6-digit security pin to access this data.</h2>

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
                <a href="/security-pin" className="forgot-password">
                    Forgot Security Pin?
                </a>
                <HStack spacing={3} style={{margin: '0 auto'}}>
                    <button onClick={checkSecurityPin} className="login-button">
                        Confirm
                    </button>
                    <button onClick={navigateToHome} className="cancel-button">
                        Back
                    </button>
                </HStack>
            </div>
        </div>
    );
}
