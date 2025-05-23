import React, {useState} from 'react'
import '../styles/Popup.css';
import { CloseButton, Spacer, Stack, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import { getAuthToken, getBaseURL, getSecurityPin } from '../utils/helperFunctions';
import toast from 'react-hot-toast';

export default function AddLabelPopup({setShowPopup, setRefresh, refresh}) {
    const [label, setLabel] = useState('');

    const createLabel = (e) =>{
        e.preventDefault();
        if(label.length === 0){
            toast.error('Enter Label Name');
            return;
        }

        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Creating Label...');

        axios.post(getBaseURL() + '/password/label', {label}, {headers : {
            Authorization : `Bearer ${token}`,
            'x-securityPin' : securityPin
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setLabel('');
                setShowPopup(false);
                setRefresh(!refresh)
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        })
    }

    return (
        <div className='popup-container'>
            <Stack direction='row'>
                <Text>Create New Label</Text>
                <Spacer/>
                <CloseButton onClick={()=>setShowPopup(false)}/>
            </Stack>

            <div className='login-form'>
                <label className="login-label">Label Name</label>
                <input type="text" name='labelName' value={label} onChange={(e)=>setLabel(e.target.value)} required className="login-input" />

                <Button onClick={createLabel}>Create Label</Button>
            </div>
        </div>
    )
}
