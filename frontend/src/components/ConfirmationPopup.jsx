import React from 'react'
import '../styles/Popup.css';
import { Text, Button } from '@chakra-ui/react';

export default function ConfirmationPopup({confirmAction, confirmButtonName, confirmMsg, setShowPopup, actionParams = null, isLoading = false}) {
    return (
        <div className='popup-container' style={{width: '300px', left: 'calc((100% - 300px)/2)'}}>
            <Text>{confirmMsg}</Text>
            <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '15px'}}>
                <Button onClick={()=>setShowPopup(false)}>Cancel</Button>
                <Button disabled={isLoading} colorScheme='red' onClick={()=>confirmAction(actionParams)}>{confirmButtonName}</Button>
            </div>
        </div>
    )
}
