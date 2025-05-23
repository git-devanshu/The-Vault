import React, { useState } from 'react'
import '../styles/Popup.css';
import axios from 'axios';
import { Button, CloseButton, Spacer, Stack, Text } from '@chakra-ui/react';
import { getAuthToken, getSecurityPin, getBaseURL } from '../utils/helperFunctions';
import toast from 'react-hot-toast';

export default function UpdatePasswordPopup({setShowPopup, refresh, setRefresh, labels, passwordData}) {
    const [data, setData] = useState({
        id : passwordData._id,
        platform : passwordData.platform,
        username : '',
        password : '',
        label : passwordData.label
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setData({
            ...data,
            [name] : value
        });
    }

    const updatePassword = (e) => {
        e.preventDefault();
        if(data.platform.length === 0 || data.username.length === 0 || data.password.length === 0 || data.label.length === 0) {
            toast.error('All fields are required');
            return;
        }

        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Updating Password...');
        setIsLoading(true);

        axios.put(getBaseURL() + '/password', data, {headers: {
                Authorization: `Bearer ${token}`,
                'x-securityPin': securityPin
            }
        })
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setShowPopup(false);
                setRefresh(!refresh);
            }
            setIsLoading(false);
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
            setIsLoading(false);
        });
    }

    return (
        <div className='popup-container'>
            <Stack direction='row'>
                <Text>Update Password</Text>
                <Spacer/>
                <CloseButton onClick={()=>setShowPopup(false)}/>
            </Stack>
            <div className='login-form'>
                <label className="login-label">Platfrom</label>
                <input type="text" name='platform' value={data.platform} onChange={handleChange} required className="login-input" />

                <label className="login-label">Updated Username</label>
                <input type="text" name='username' value={data.username} onChange={handleChange} required className="login-input" />

                <label className="login-label">Updated Password</label>
                <input type="text" name='password' value={data.password} onChange={handleChange} required className="login-input" />

                <label className="login-label">Label</label>
                <select className="login-input" name='label' value={data.label} onChange={handleChange} required>
                    <option value="">-- Select Label --</option>
                    {labels.map((label, index) => (
                        <option key={index} value={label}>{label}</option>
                    ))}
                </select>

                <Button disabled={isLoading} onClick={updatePassword}>Update Password</Button>
            </div>
        </div>
    )
}
