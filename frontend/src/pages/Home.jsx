import React, { useEffect, useState } from 'react'
import '../styles/Home.css';
import { HiOutlineLockClosed } from 'react-icons/hi';
import {Avatar, Heading, Text} from '@chakra-ui/react';
import {ArrowForwardIcon} from '@chakra-ui/icons';
import { decodeToken, getAuthToken, removeAuthToken, removeSecurityPin } from '../utils/helperFunctions';
import {useNavigate} from 'react-router-dom';
import ConfirmationPopup from '../components/ConfirmationPopup';

export default function Home() {
    const navigate = useNavigate();
    const name = decodeToken(getAuthToken()).name;

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    useEffect(()=>{
        removeSecurityPin();
    }, []);

    const navigateToVault = (vaultName) =>{
        navigate(`/vault/${vaultName}`);
    }

    const logout = () =>{
        removeAuthToken();
        navigate('/login');
    }

    return (
        <div className='parent-container'>
            {/* header */}
            <div className='top-header'>
                <div>
                    <HiOutlineLockClosed size={24} color='#2daaff'/>
                    <h1>Vault</h1>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <button onClick={()=> setShowLogoutPopup(true)} style={{marginRight: '15px', height: '30px', marginTop: '0'}}>Logout</button>
                    <Avatar size='sm' name={name}/>
                </div>
            </div>

            {/* main section */}
            <div className='main-section'>
                <div>
                    <h1>A Secure Place for your Personal Data</h1>
                </div>
                <HiOutlineLockClosed size='55%' className='side-logo'/>
            </div>

            {/* modules */}
            <div className='module-stack'>
                <div onClick={()=> navigateToVault('password')} style={{height:'110px', width:'250px', backgroundColor:'rgb(254, 187, 64)', borderRadius:'15px', padding: '10px'}} className='card-mp'>
                    <Heading color='blackAlpha.800' mt={4} fontFamily='body' fontSize={20} fontWeight={700}>Passwords <ArrowForwardIcon mt='-5px' h={5} w={5}/></Heading>
                    <Text color='blackAlpha.700' mr={3} fontFamily='body' fontSize={15} fontWeight={500}>Store all your passwords securely.</Text>
                </div>
                <div onClick={()=> navigateToVault('tasklist-not-build')} style={{height:'110px', width:'250px', backgroundColor:'rgb(97, 177, 226)', borderRadius:'15px', padding: '10px'}} className='card-mp'>            
                    <Heading color='blackAlpha.800' mt={4} fontFamily='body' fontSize={20} fontWeight={700}>Tasklist <ArrowForwardIcon mt='-5px' h={5} w={5}/></Heading>
                    <Text color='blackAlpha.700' mr={3} fontFamily='body' fontSize={15} fontWeight={500}>List all your secret tasks.</Text>
                </div>
                <div onClick={()=> navigateToVault('daily-not-build')} style={{height:'110px', width:'250px', backgroundColor:'rgba(255, 255, 255, 0.100)', borderRadius:'15px', boxShadow:'0 0 20px 10px rgb(210, 210, 210, 0.200) inset', padding: '10px'}} className='card-mp'>
                    <Heading color='blackAlpha.800' mt={4} fontFamily='body' fontSize={20} fontWeight={700}>Daily Notes <ArrowForwardIcon mt='-5px' h={5} w={5}/></Heading>
                    <Text color='blackAlpha.700' mr={3} fontFamily='body' fontSize={15} fontWeight={500}>Write a note on your special day.</Text>
                </div>
                <div onClick={()=> navigateToVault('notes-not-build')} style={{height:'110px', width:'250px', backgroundColor:'rgba(255, 255, 255, 0.100)', borderRadius:'15px', boxShadow:'0 0 20px 10px rgb(210, 210, 210, 0.200) inset', padding: '10px'}} className='card-mp'>
                    <Heading color='blackAlpha.800' mt={4} fontFamily='body' fontSize={20} fontWeight={700}>Notebook <ArrowForwardIcon mt='-5px' h={5} w={5}/></Heading>
                    <Text color='blackAlpha.700' mr={3} fontFamily='body' fontSize={15} fontWeight={500}>Keep notes of your data securely.</Text>
                </div>
            </div>

            {/* about section */}
            <div className='about-section'>
                <Text color='gray' textAlign='center'>
                    The Vault is a secure data storage that allows you to store your personal data including your 
                    passwords, your daily experiences, general notes and tasks, all protected by a 6 digit pin adding an extra layer of security.
                    The sensitive data is stored on the cloud completely encrypted to ensure privacy.
                </Text>
            </div>

            {showLogoutPopup && <ConfirmationPopup confirmAction={logout} confirmButtonName='Logout' confirmMsg='Do you want to log out?' setShowPopup={setShowLogoutPopup}/>}
        </div>
    );
}
