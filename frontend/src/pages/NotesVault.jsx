import React, { useEffect, useState } from 'react'
import {getSecurityPin, removeSecurityPin} from '../utils/helperFunctions';
import '../styles/Vault.css';
import PinModal from '../components/PinModal';

export default function NotesVault() {
    const [securityPin, setSecurityPin] = useState(getSecurityPin());

    useEffect(()=>{
        return () =>{
            removeSecurityPin();
        }
    }, []);

    if(!securityPin){
        return(
            <PinModal/>
        );
    }

    return (
        <div>
            Notes Vault
        </div>
    );
}
