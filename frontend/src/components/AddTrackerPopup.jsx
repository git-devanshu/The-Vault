import React, {useState} from 'react'
import '../styles/Popup.css';
import { CloseButton, Spacer, Stack, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import { getAuthToken, getBaseURL, getSecurityPin } from '../utils/helperFunctions';
import toast from 'react-hot-toast';

export default function AddTrackerPopup({setShowPopup, setRefresh, refresh}) {
    const [trackerName, setTrackerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createTracker = (e) =>{
        e.preventDefault();
        if(trackerName.length === 0){
            toast.error('Enter Tracker Name');
            return;
        }

        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Creating Tracker...');
        setIsLoading(true);

        axios.post(getBaseURL() + '/expense/tracker-data', {trackerName}, {headers : {
            Authorization : `Bearer ${token}`,
            'x-securityPin' : securityPin
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setTrackerName('');
                setShowPopup(false);
                setRefresh(!refresh)
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
        <div className='popup-container'>
            <Stack direction='row'>
                <Text>Create New Tracker</Text>
                <Spacer/>
                <CloseButton onClick={()=>setShowPopup(false)}/>
            </Stack>

            <div className='login-form'>
                <label className="login-label">Tracker Name</label>
                <input type="text" name='trackerName' value={trackerName} onChange={(e)=>setTrackerName(e.target.value)} required className="login-input" />

                <Button disabled={isLoading} onClick={createTracker}>Create Tracker</Button>
            </div>
        </div>
    );
}
