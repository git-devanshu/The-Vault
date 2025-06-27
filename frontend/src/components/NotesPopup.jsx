import React, {useState} from 'react'
import '../styles/Popup.css';
import { CloseButton, Spacer, Stack, Text, Button, ButtonGroup } from '@chakra-ui/react';
import { DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { getAuthToken, getBaseURL, getSecurityPin } from '../utils/helperFunctions';
import toast from 'react-hot-toast';
import ConfirmationPopup from './ConfirmationPopup';
import { TwitterPicker } from 'react-color';

export default function NotesPopup({setShowPopup, creating, data, setRefresh, refresh}) {
    const [title, setTitle] = useState(creating ? '' : data.title);
    const [note, setNote] = useState(creating ? '' : data.note);
    const [categoryColor, setCategoryColor] = useState(creating ? '' : data.categoryColor);

    const [changed, setChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showRemoveNotePopup, setShowRemoveNotePopup] = useState(false);
    
    const basicColors = ['red', 'yellow', 'orange', 'blue', 'cyan', 'green', 'lime', 'gray', 'brown', 'black', 'white'];
    const customStyles = {
        default: {
            card: {
                background: '#121826',
                borderRadius: '10px',
                marginBottom: '15px'
            },
            body: { padding: '8px' },
            hash: { display: 'none' },
            input: { height: '30px', width: '93px', borderRadius: '10px' }
        }
    };

    const addNote = (e) =>{
        e.preventDefault();
        if(title.length === 0 || note.length === 0 || categoryColor.length === 0) {
            toast.error('All fields are required');
            return;
        }

        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Creating a Note...');
        setIsLoading(true);

        axios.post(getBaseURL() + '/notes', {title, note, categoryColor}, {headers: {
                Authorization: `Bearer ${token}`,
                'x-securityPin': securityPin
            }
        })
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setShowPopup(false);
                setRefresh(!refresh);
                setChanged(false);
            }
            setIsLoading(false);
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
            setIsLoading(false);
        });
    }

    const updateNote = (e) =>{
        e.preventDefault();
        if(title.length === 0 || note.length === 0 || categoryColor.length === 0) {
            toast.error('All fields are required');
            return;
        }

        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Updating Note...');
        setIsLoading(true);

        axios.put(getBaseURL() + '/notes', {noteId: data._id, title, note, categoryColor}, {headers: {
                Authorization: `Bearer ${token}`,
                'x-securityPin': securityPin
            }
        })
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setShowPopup(false);
                setRefresh(!refresh);
                setChanged(false);
            }
            setIsLoading(false);
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
            setIsLoading(false);
        });
    }

    const removeNote = (noteId) =>{
        if(!noteId) {
            toast.error('Something went wrong!');
            return;
        }

        const token = getAuthToken();
        const securityPin = getSecurityPin();
        const toastId = toast.loading('Deleting Note...');
        setIsLoading(true);

        axios.delete(getBaseURL() + `/notes/${noteId}`, {headers: {
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
            setIsLoading(false);
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
            setIsLoading(false);
        });
    }

    return (
        <div className='popup-container' style={{height: '98%', width: '98%', top: '1%', left: '1%'}}>
            <Stack direction='row' align='center'>
                <Text color='white'>Notes</Text>
                <Spacer/>
                <CloseButton color='white' onClick={()=> setShowPopup(false)}/>
            </Stack>

            <div className='login-form'>
                <label className="login-label">Title</label>
                <input type="text" name='title' value={title} onChange={(e)=> {setTitle(e.target.value); setChanged(true)}} required className="login-input" />

                <label className="login-label">Category Color</label>
                <TwitterPicker triangle="hide" colors={basicColors} color={categoryColor} onChangeComplete={(c)=> {setCategoryColor(c.hex); setChanged(true)}} styles={customStyles}/>

                <label className="login-label">Note</label>
                <textarea type="text" name='note' value={note} onChange={(e)=> {setNote(e.target.value); setChanged(true)}} required className="login-input" style={{height: '200px'}} />

                <ButtonGroup mt={6}>
                    {creating ? 
                        <Button disabled={!changed || isLoading} onClick={addNote} leftIcon={<PlusSquareIcon />}>Add</Button> : 
                        <Button disabled={!changed || isLoading} onClick={updateNote} leftIcon={<PlusSquareIcon />}>Update</Button>
                    }
                    {!creating && <Button disabled={isLoading} onClick={()=> setShowRemoveNotePopup(true)} colorScheme='red' leftIcon={<DeleteIcon />}>Delete</Button>}
                </ButtonGroup>
            </div>

            {/* Remove Note Popup */}
            {showRemoveNotePopup && <ConfirmationPopup confirmButtonName='Delete' confirmMsg='Are you sure, you want to remove this note?' setShowPopup={setShowRemoveNotePopup} confirmAction={removeNote} actionParams={data._id} isLoading={isLoading}/>}
        </div>
    );
}
