import React, {useState} from 'react'
import '../styles/Popup.css';
import { Heading, Stack, Text, Spacer, CloseButton, Box } from '@chakra-ui/react';

export default function ViewNotePopup({setShowPopup, data}) {
    return (
        <div className='popup-container' style={{height: '98%', width: '98%', top: '1%', left: '1%', overflowY: 'scroll', scrollbarWidth: 'none'}}>
            <Stack direction='row' align='center'>
                <Text color='white'>Read Note</Text>
                <Spacer/>
                <CloseButton color='white' onClick={()=> setShowPopup(false)}/>
            </Stack>

            <div className='login-form'>
                <Heading size='md' mt={3} mb={7}>{data.title}</Heading>
                <Box whiteSpace='pre-wrap'>{data.note}</Box>
            </div>
        </div>
    );
}
