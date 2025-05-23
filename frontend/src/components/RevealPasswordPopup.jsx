import React, { useEffect, useState } from 'react'
import '../styles/Popup.css';
import { CloseButton, Heading, Spacer, Spinner, Stack, Text, Button } from '@chakra-ui/react';
import { fetchSecureData } from '../axios/axiosRequest';
import { WarningIcon, CopyIcon } from '@chakra-ui/icons';
import toast from 'react-hot-toast';

export default function RevealPasswordPopup({setShowPopup, passwordId}) {
    const [data, setData] = useState();
    const [error, setError] = useState();

    useEffect(()=>{
        const fetchData = () =>{
            if(!passwordId || passwordId.length === 0){
                setError('Something Went Wrong!');
                return;
            }
            fetchSecureData(`/password/${passwordId}`, setData, setError);
        }
        fetchData();
    }, []);

    const copyUsername = () =>{
        navigator.clipboard.writeText(data.decryptedUsername);
        toast.success('Username copied to clipboard');
    }

    const copyPassword = () =>{
        navigator.clipboard.writeText(data.decryptedPassword);
        toast.success('Password copied to clipboard');
    }

    return (
        <div className='popup-container'>
            <Stack direction='row' mb={2}>
                <Heading size='md'>Password</Heading>
                <Spacer/>
                <CloseButton onClick={()=> setShowPopup(false)}/>
            </Stack>
            {!data && !error && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <Spinner mb={3}/>
                <Text>Loading Credentials</Text>
            </div>}
            {error && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <WarningIcon boxSize={6} color='red' m={3}/>
                <Text>{error}</Text>
            </div>}
            {data && <div className='login-form'>
                <Text mb={2}>{data.platform}</Text>
                <label className="login-label">Username</label>
                <input type="text" name='username' value={data.decryptedUsername} readOnly className="login-input" />
                <label className="login-label">Password</label>
                <input type="text" name='password' value={data.decryptedPassword} readOnly className="login-input" />
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button onClick={copyUsername} leftIcon={<CopyIcon/>}>Username</Button>
                    <Button onClick={copyPassword} leftIcon={<CopyIcon/>}>Password</Button>
                </div>
            </div>}
        </div>
    );
}
