import React, { useEffect, useState, useMemo } from 'react'
import {getAuthToken, getBaseURL, getSecurityPin, removeSecurityPin} from '../utils/helperFunctions';
import '../styles/Vault.css';
import PinModal from '../components/PinModal';
import Loading from '../components/Loading';
import { fetchSecureData } from '../axios/axiosRequest';
import toast from 'react-hot-toast';
import { Badge, Button, ButtonGroup, Heading, IconButton, Text } from '@chakra-ui/react';
import {PlusSquareIcon, DeleteIcon, EditIcon, ViewIcon} from '@chakra-ui/icons';
import { FaSortAlphaDown } from 'react-icons/fa';
import AddLabelPopup from '../components/AddLabelPopup';
import ConfirmationPopup from '../components/ConfirmationPopup';
import axios from 'axios';
import AddPasswordPopup from '../components/AddPasswordPopup';
import RevealPasswordPopup from '../components/RevealPasswordPopup';
import UpdatePasswordPopup from '../components/UpdatePasswordPopup';

export default function PasswordVault() {
    const [securityPin, setSecurityPin] = useState(getSecurityPin());

    const [labels, setLabels] = useState();
    const [data, setData] = useState();

    const [error, setError] = useState();
    const [refresh, setRefresh] = useState(false);

    const [labelToBeRemoved, setLabelToBeRemoved] = useState('');
    const [passwordId, setPasswordId] = useState('');
    const [passwordData, setPasswordData] = useState({});

    const [query, setQuery] = useState('');
    const [sortDesc, setSortDesc] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showAddLabelPopup, setShowAddLabelPopup] = useState(false);
    const [showRemoveLabelPopup, setShowRemoveLabelPopup] = useState(false);
    const [showAddPasswordPopup, setShowAddPasswordPopup] = useState(false);
    const [showRevealPasswordPopup, setShowRevealPasswordPopup] = useState(false);
    const [showRemovePasswordPopup, setShowRemovePasswordPopup] = useState(false);
    const [showUpdatePasswordPopup, setShowUpdatePasswordPopup] = useState(false);

    // for removing the security pin after exiting the module
    useEffect(()=>{
        const handleBeforeUnload = () =>{
            sessionStorage.setItem('preservePin', 'true');
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return ()=>{
            window.removeEventListener('beforeunload', handleBeforeUnload);
            const preserve = sessionStorage.getItem('preservePin');
            if(!preserve){
                removeSecurityPin();
            }
            sessionStorage.removeItem('preservePin');
        };
    }, []);
    
    useEffect(()=>{
        fetchSecureData('/password', setData, setError);
        fetchSecureData('/password/label', setLabels, setError);
    }, [refresh]);

    const filtered = useMemo(() => {
        if(!query.trim()) return data;
        const q = query.toLowerCase();
        return data.filter(item =>
            item.platform.toLowerCase().includes(q)
        );
    }, [data, query]);

    const removeLabel = (labelName) =>{
        if(!labelName || labelName.length === 0){
            return;
        }
        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Removing Label...');
        setIsLoading(true);

        axios.delete(getBaseURL() + `/password/label/${labelName}`, {headers : {
            Authorization : `Bearer ${token}`,
            'x-securityPin' : securityPin
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setRefresh(!refresh);
                setShowRemoveLabelPopup(false);
            }
            setIsLoading(false);
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
            setIsLoading(false);
        });
    }

    const removePassword = (passwordId) =>{
        if(!passwordId || passwordId.length === 0){
            return;
        }
        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Removing Password...');
        setIsLoading(true);

        axios.delete(getBaseURL() + `/password/${passwordId}`, {headers : {
            Authorization : `Bearer ${token}`,
            'x-securityPin' : securityPin
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setRefresh(!refresh);
                setShowRemovePasswordPopup(false);
            }
            setIsLoading(false);
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
            setIsLoading(false);
        });
    }
  
    if(!securityPin){
        return <PinModal/>
    }

    if(!data){
        return <Loading data='Password Lists' error={error}/>
    }

    if(!labels){
        return <Loading data='Labels' error={error}/>
    }

    return (
        <div className='vault-container'>
            <Heading className='vault-heading' color='#2daaff' size='lg'>Password Vault</Heading>
            <ButtonGroup mt={6}>
                <Button onClick={()=> setShowAddPasswordPopup(true)} leftIcon={<PlusSquareIcon />}>Password</Button>
                <Button onClick={()=> setShowAddLabelPopup(true)} variant='outline' color='white' _hover={{bgColor: 'transparent'}} leftIcon={<PlusSquareIcon />}>Label</Button>
            </ButtonGroup>

            <div className='vault-grid'>
                <div className='grid-inner-left'>
                    <Text fontFamily='revert' fontSize='18px' mb={5} textAlign='center' fontWeight={500}>MY LABELS</Text>
                    
                    <div className='label-list-div'>
                        {labels?.map((item, ind)=>{
                            return(
                                <div className='label-item' key={ind}>
                                    <Text fontSize='18px' color='#aaaaaa'>{item}</Text>
                                    {ind !== 0 && <IconButton onClick={()=>{setLabelToBeRemoved(item); setShowRemoveLabelPopup(true)}} variant='outline' colorScheme='red' _hover={{bgColor: 'transparent'}} h='34px' icon={<DeleteIcon />}></IconButton>}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className='grid-inner-right'>
                    <Text fontFamily='revert' fontSize='18px' mb={5} textAlign='center' fontWeight={500}>MY PASSWORDS</Text>

                    <input className="login-input" value={query} onChange={(e)=> setQuery(e.target.value)} placeholder='Search Password' style={{marginRight: '15px'}}/>
                    <IconButton onClick={()=> setSortDesc(!sortDesc)} icon={<FaSortAlphaDown/>}></IconButton>
                    
                    {(!filtered || filtered.length === 0) && <Text color='#aaa' mt={8} textAlign='center'>No Passwords Found.</Text>}
                    
                    {filtered?.length > 0 && <div className='password-card-div'>
                        {(sortDesc ? [...filtered].reverse() : filtered).map((item, ind)=>{
                            return(
                                <div className='password-card' key={ind}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                        <Heading size='md'>{item.platform}</Heading>
                                        <Badge>{item.label}</Badge>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
                                        <Button onClick={()=> {setPasswordId(item._id); setShowRevealPasswordPopup(true)}} leftIcon={<ViewIcon/>}>View</Button>
                                        <Button onClick={()=> {setPasswordData(item); setShowUpdatePasswordPopup(true)}} leftIcon={<EditIcon/>}>Edit</Button>
                                        <Button onClick={()=>{setPasswordId(item._id); setShowRemovePasswordPopup(true)}} colorScheme='red' leftIcon={<DeleteIcon/>}>Delete</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
                </div>
            </div>

            {/* Label Popups */}
            {showAddLabelPopup && <AddLabelPopup setShowPopup={setShowAddLabelPopup} setRefresh={setRefresh} refresh={refresh}/>}
            {showRemoveLabelPopup && <ConfirmationPopup confirmButtonName='Delete' confirmMsg='Do you want to delete this label, your passwords will not be removed?' setShowPopup={setShowRemoveLabelPopup} confirmAction={removeLabel} actionParams={labelToBeRemoved} isLoading={isLoading}/>}

            {/* Password Popups */}
            {showAddPasswordPopup && <AddPasswordPopup refresh={refresh} setRefresh={setRefresh} setShowPopup={setShowAddPasswordPopup} labels={labels}/>}
            {showRevealPasswordPopup && <RevealPasswordPopup setShowPopup={setShowRevealPasswordPopup} passwordId={passwordId}/>}
            {showRemovePasswordPopup && <ConfirmationPopup confirmButtonName='Delete' confirmMsg='Do you want to delete this password and credentials?' setShowPopup={setShowRemovePasswordPopup} confirmAction={removePassword} actionParams={passwordId} isLoading={isLoading}/>}
            {showUpdatePasswordPopup && <UpdatePasswordPopup refresh={refresh} setRefresh={setRefresh} setShowPopup={setShowUpdatePasswordPopup} labels={labels} passwordData={passwordData}/>}
        </div>
    );
}
