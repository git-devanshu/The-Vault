import React, { useEffect, useState, useMemo } from 'react'
import {getSecurityPin, removeSecurityPin} from '../utils/helperFunctions';
import '../styles/Vault.css';
import PinModal from '../components/PinModal';
import Loading from '../components/Loading';
import { fetchSecureData } from '../axios/axiosRequest';
import { IconButton, Button, ButtonGroup, Heading, Spacer, Text, Wrap, WrapItem, Stack } from '@chakra-ui/react';
import {EditIcon, PlusSquareIcon, ViewIcon} from '@chakra-ui/icons';
import { FaSortAlphaDown } from 'react-icons/fa';
import NotesPopup from '../components/NotesPopup';
import ViewNotePopup from '../components/ViewNotePopup';

export default function NotesVault() {
    const [securityPin, setSecurityPin] = useState(getSecurityPin());
    const [query, setQuery] = useState('');
    const [sortDesc, setSortDesc] = useState(false);

    const [notesData, setNotesData] = useState();
    const [currentNoteData, setCurrentNoteData] = useState();

    const [error, setError] = useState();
    const [refresh, setRefresh] = useState(false);

    const [showAddNotesPopup, setShowAddNotesPopup] = useState(false);
    const [showUpdateNotesPopup, setShowUpdateNotesPopup] = useState(false);
    const [showViewNotesPopup, setShowViewNotesPopup] = useState(false);

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
        fetchSecureData('/notes', setNotesData, setError);
    }, [refresh]);

    const filtered = useMemo(() => {
        if(!query.trim()) return notesData;
        const q = query.toLowerCase();
        return notesData.filter(item =>
            item.title.toLowerCase().includes(q)
        );
    }, [notesData, query]);

    if(!securityPin){
        return(
            <PinModal/>
        );
    }

    if(!notesData){
        return <Loading data='Notes' error={error}/>
    }

    return (
        <div className='vault-container'>
            <Heading className='vault-heading' color='#2daaff' size='lg'>Notes Vault</Heading>
            <ButtonGroup mt={6} alignItems='center'>
                <Button onClick={()=> setShowAddNotesPopup(true)} leftIcon={<PlusSquareIcon />}>Note</Button>
                <input className="login-input" value={query} onChange={(e)=> setQuery(e.target.value)} placeholder='Search Title' style={{marginBottom: 0}}/>
                <IconButton onClick={()=> setSortDesc(!sortDesc)} icon={<FaSortAlphaDown/>}></IconButton>
            </ButtonGroup>

            {/* Display the notes */}
            {filtered.length === 0 && <Text color='#aaa' mt={8} textAlign='center'>You haven't added any notes yet.</Text>}
            {filtered.length !== 0 && 
                <Wrap spacing='15px' mt={5}>
                    {(sortDesc ? [...filtered].reverse() : filtered).map((note, index) => {
                        return(
                            <WrapItem key={index}>
                                <Stack className='password-card' style={{width: '160px', minWidth: '160px', borderLeft: `8px solid ${note.categoryColor}`, height: '190px'}}>
                                    <Text fontSize='17px'>{note.title.slice(0, 55)}...</Text>
                                    <Spacer/>
                                    <ButtonGroup>
                                        <IconButton onClick={()=> {setCurrentNoteData(note); setShowViewNotesPopup(true)}} icon={<ViewIcon />}></IconButton>
                                        <IconButton onClick={()=> {setCurrentNoteData(note); setShowUpdateNotesPopup(true)}} icon={<EditIcon />} variant='outline' color='white' _hover={{bgColor: 'transparent'}}></IconButton>
                                    </ButtonGroup>
                                </Stack>
                            </WrapItem>
                        );
                    })}
                </Wrap>
            }

            {/* Notes Popups */}
            {showAddNotesPopup && <NotesPopup creating={true} setShowPopup={setShowAddNotesPopup} setRefresh={setRefresh} refresh={refresh}/>}
            {showUpdateNotesPopup && <NotesPopup creating={false} data={currentNoteData} setRefresh={setRefresh} refresh={refresh} setShowPopup={setShowUpdateNotesPopup}/>}
            {showViewNotesPopup && <ViewNotePopup data={currentNoteData} setShowPopup={setShowViewNotesPopup}/>}
        </div>
    );
}
