import React, { useState } from 'react'
import '../styles/Popup.css';
import axios from 'axios';
import { Button, CloseButton, Spacer, Stack, Text } from '@chakra-ui/react';
import { getAuthToken, getSecurityPin, getBaseURL } from '../utils/helperFunctions';
import toast from 'react-hot-toast';

export default function AddPasswordPopup({setShowPopup, refresh, setRefresh, labels}) {
    const [data, setData] = useState({
        platform : '',
        username : '',
        password : '',
        label : ''
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setData({
            ...data,
            [name] : value
        });
    }

    const addPassword = (e) => {
        e.preventDefault();
        if(data.platform.length === 0 || data.username.length === 0 || data.password.length === 0 || data.label.length === 0) {
            toast.error('All fields are required');
            return;
        }

        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Adding Password...');

        axios.post(getBaseURL() + '/password', data, {headers: {
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
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }

    return (
        <div className='popup-container'>
            <Stack direction='row'>
                <Text>Add New Password</Text>
                <Spacer/>
                <CloseButton onClick={()=>setShowPopup(false)}/>
            </Stack>
            <div className='login-form'>
                <label className="login-label">Platfrom</label>
                <input type="text" name='platform' value={data.platform} onChange={handleChange} required className="login-input" />

                <label className="login-label">Username</label>
                <input type="text" name='username' value={data.username} onChange={handleChange} required className="login-input" />

                <label className="login-label">Password</label>
                <input type="text" name='password' value={data.password} onChange={handleChange} required className="login-input" />

                <label className="login-label">Label</label>
                <select className="login-input" name='label' value={data.label} onChange={handleChange} required>
                    <option value="">-- Select Label --</option>
                    {labels.map((label, index) => (
                        <option key={index} value={label}>{label}</option>
                    ))}
                </select>

                <Button onClick={addPassword}>Add Password</Button>
            </div>
        </div>
    )
}
