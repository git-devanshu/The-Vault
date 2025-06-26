import React, {useState} from 'react'
import '../styles/Popup.css';
import { CloseButton, Spacer, Stack, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import { getAuthToken, getBaseURL, getSecurityPin } from '../utils/helperFunctions';
import toast from 'react-hot-toast';

export default function AddExpensePopup({setShowPopup, setRefresh, refresh, trackerName}) {
    const [amount, setAmount] = useState();
    const [spentAt, setSpentAt] = useState('');
    const [spentOnDate, setSpentOnDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createExpense = (e) =>{
        e.preventDefault();
        if(spentAt.length === 0 || spentOnDate.length === 0 || amount?.length === 0){
            toast.error('Enter All Details');
            return;
        }

        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Adding Expense...');
        setIsLoading(true);

        axios.post(getBaseURL() + '/expense', {amount, spentAt, spentOnDate, trackerName}, {headers : {
            Authorization : `Bearer ${token}`,
            'x-securityPin' : securityPin
        }})
        .then(res =>{
            if(res.status === 200){
                setAmount();
                setSpentAt('');
                toast.success(res.data.message, {id : toastId});
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
                <Text>Add Expense to List</Text>
                <Spacer/>
                <CloseButton onClick={()=>setShowPopup(false)}/>
            </Stack>

            <div className='login-form'>
                <label className="login-label">Spent At</label>
                <input type="text" name='spentAt' value={spentAt} onChange={(e)=>setSpentAt(e.target.value)} required className="login-input" />

                <label className="login-label">Amount</label>
                <input type="number" name='amount' value={amount} onChange={(e)=>setAmount(e.target.value)} required className="login-input" />

                <label className="login-label">Spent on Date</label>
                <input type="date" name='spentOnDate' value={spentOnDate} onChange={(e)=>setSpentOnDate(e.target.value)} required className="login-input" />

                <Button disabled={isLoading} onClick={createExpense}>Add Expense</Button>
            </div>
        </div>
    );
}
