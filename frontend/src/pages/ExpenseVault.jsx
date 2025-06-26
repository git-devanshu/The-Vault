import React, { useEffect, useState } from 'react'
import {getAuthToken, getBaseURL, getSecurityPin, removeSecurityPin} from '../utils/helperFunctions';
import '../styles/Vault.css';
import PinModal from '../components/PinModal';
import Loading from '../components/Loading';
import { fetchSecureData } from '../axios/axiosRequest';
import toast from 'react-hot-toast';
import { Badge, Button, ButtonGroup, Heading, IconButton, Spacer, Stack, Text } from '@chakra-ui/react';
import {PlusSquareIcon, DeleteIcon} from '@chakra-ui/icons';
import axios from 'axios';
import ConfirmationPopup from '../components/ConfirmationPopup';
import AddTrackerPopup from '../components/AddTrackerPopup';
import AddExpensePopup from '../components/AddExpensePopup';

export default function ExpenseVault() {
    const [securityPin, setSecurityPin] = useState(getSecurityPin());

    const [trackerData, setTrackerData] = useState();
    const [expenseData, setExpenseData] = useState();
    const [totalExpense, setTotalExpense] = useState(0);

    const [error, setError] = useState();
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [currentTracker, setCurrentTracker] = useState('Other');

    // for action params
    const [trackerToBeRemoved, setTrackerToBeRemoved] = useState('');
    const [expenseId, setExpenseId] = useState('');

    const [showAddTrackerPopup, setShowAddTrackerPopup] = useState(false);
    const [showRemoveTrackerPopup, setShowRemoveTrackerPopup] = useState(false);
    const [showAddExpensePopup, setShowAddExpensePopup] = useState(false);
    const [showRemoveExpensePopup, setShowRemoveExpensePopup] = useState(false);
    
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
        fetchSecureData('/expense/tracker-data', setTrackerData, setError);
        fetchCurrentTrackerExpenses();
    }, [currentTracker, refresh]);

    const fetchCurrentTrackerExpenses = () =>{
        const token = getAuthToken();
        if(!securityPin){
            setError('No security pin provided');
            return;
        }
        axios.get(getBaseURL() + `/expense/${currentTracker}`, {headers : {
            Authorization : `Bearer ${token}`,
            'x-securityPin' : securityPin
        }})
        .then(res =>{
            if(res.status === 200){
                setExpenseData(res.data.expenseData);
                setTotalExpense(res.data.totalExpense);
            }
        })
        .catch(err =>{
            console.log(err);
            setError('Failed to load the data');
        });
    }

    const removeTracker = (trackerName) =>{
        if(!trackerName || trackerName.length === 0){
            return;
        }
        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Removing Tracker...');
        setIsLoading(true);

        axios.delete(getBaseURL() + `/expense/tracker-data/${trackerName}`, {headers : {
            Authorization : `Bearer ${token}`,
            'x-securityPin' : securityPin
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setRefresh(!refresh);
                setShowRemoveTrackerPopup(false);
                setCurrentTracker('Other');
            }
            setIsLoading(false);
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
            setIsLoading(false);
        });
    }

    const removeExpense = (expenseId) =>{
        if(!expenseId || expenseId.length === 0){
            return;
        }
        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Removing Expense...');
        setIsLoading(true);

        axios.delete(getBaseURL() + `/expense/${expenseId}`, {headers : {
            Authorization : `Bearer ${token}`,
            'x-securityPin' : securityPin
        }})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setRefresh(!refresh);
                setShowRemoveExpensePopup(false);
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

    if(!trackerData){
        return <Loading data='Tracker List' error={error}/>
    }

    if(!expenseData){
        return <Loading data='Expenses' error={error}/>
    }

    return (
        <div className='vault-container'>
            <Heading className='vault-heading' color='#2daaff' size='lg'>Password Vault</Heading>

            <ButtonGroup mt={6}>
                <Button onClick={()=>{setShowAddTrackerPopup(true)}} leftIcon={<PlusSquareIcon />}>Tracker</Button>
            </ButtonGroup>

            <div className='vault-grid'>
                <div className='grid-inner-left'>
                    <Text fontFamily='revert' fontSize='18px' mb={5} textAlign='center' fontWeight={500}>MY TRACKERS</Text>

                    <div className='label-list-div'>
                        {trackerData?.map((item, ind)=>{
                            return(
                                <div className='label-item' key={ind}>
                                    <div onClick={()=> setCurrentTracker(item)} style={{cursor: 'pointer', width: '80%'}}>
                                        <Text fontSize='18px' color='#aaaaaa'>{item}</Text>
                                    </div>
                                    {ind !== 0 && <IconButton onClick={()=>{setShowRemoveTrackerPopup(true); setTrackerToBeRemoved(item)}} variant='outline' colorScheme='red' _hover={{bgColor: 'transparent'}} h='34px' icon={<DeleteIcon />}></IconButton>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='grid-inner-right'>
                    <Text fontFamily='revert' fontSize='18px' mb={2} textAlign='center' fontWeight={500}>MY EXPENSES</Text>
                    <Text fontFamily='revert' fontSize='18px' mb={5} textAlign='center' fontWeight={400} color='#2daaff'>{currentTracker}</Text>
                    <Stack direction='row' align='center' mb={3}>
                        <Text fontFamily='revert' fontSize='18px' textAlign='center' fontWeight={400} color='#2daaff'>Spent - {totalExpense}</Text>
                        <Spacer/>
                        <Button onClick={()=>{setShowAddExpensePopup(true)}} variant='outline' color='white' leftIcon={<PlusSquareIcon />}>Expense</Button>
                    </Stack>

                    {expenseData?.length === 0 && <Text color='#aaa' mt={8} textAlign='center'>You haven't added any expenses under this tracker.</Text>}

                    {expenseData?.length > 0 && <div className='password-card-div'>
                        {expenseData.map((item, ind)=>{
                            return(
                                <div className='password-card' key={ind}>
                                    <Heading size='md'>{item.spentAt}</Heading>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                        <Text>{item.amount}</Text>
                                        <Badge>{item.spentOnDate.split('T')[0]}</Badge>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
                                        <Button onClick={()=>{setShowRemoveExpensePopup(true); setExpenseId(item._id)}} colorScheme='red' leftIcon={<DeleteIcon/>}>Delete</Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>}
                </div>
            </div>

            {/* Tracker popups */}
            {showAddTrackerPopup && <AddTrackerPopup setShowPopup={setShowAddTrackerPopup} setRefresh={setRefresh} refresh={refresh}/>}
            {showRemoveTrackerPopup && <ConfirmationPopup confirmButtonName='Delete' confirmMsg='Do you want to delete this tracker, your expenses will not be removed?' setShowPopup={setShowRemoveTrackerPopup} confirmAction={removeTracker} actionParams={trackerToBeRemoved} isLoading={isLoading}/>}

            {/* Expense popups */}
            {showAddExpensePopup && <AddExpensePopup setShowPopup={setShowAddExpensePopup} setRefresh={setRefresh} refresh={refresh} trackerName={currentTracker}/>}
            {showRemoveExpensePopup && <ConfirmationPopup confirmButtonName='Delete' confirmMsg='Do you want to delete this expense?' setShowPopup={setShowRemoveExpensePopup} confirmAction={removeExpense} actionParams={expenseId} isLoading={isLoading}/>}
        </div>
    );
}
