import React from 'react'
import {Toaster} from 'react-hot-toast';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {ChakraProvider} from '@chakra-ui/react';
import {getAuthToken, decodeToken} from './utils/helperFunctions';

// import components
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import SecurityPin from './pages/SecurityPin';
import DailyVault from './pages/DailyVault';
import NotesVault from './pages/NotesVault';
import PasswordVault from './pages/PasswordVault';
import TasklistVault from './pages/TasklistVault';
import ExpenseVault from './pages/ExpenseVault';


export default function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    {/* Authentication Routes */}
                    <Route path='/login' element={<CheckLogin/>} />
                    <Route path='/signup' element={<CheckSignup/>} />
                    <Route path='/reset-password' element={<ResetPassword/>} />

                    {/* Main Routes */}
                    <Route path='/' element={<ProtectedHome/>} />
                    <Route path='/security-pin' element={<ProtectedSecurityPinReset/>} />
                    <Route path='/vault/password' element={<ProtectedPasswordVault/>} />
                    <Route path='/vault/notes' element={<ProtectedNotesVault/>} />
                    <Route path='/vault/tasklist' element={<ProtectedTasklistVault/>} />
                    <Route path='/vault/daily' element={<ProtectedDailyVault/>} />
                    <Route path='/vault/expenses' element={<ProtectedExpenseVault/>} />

                    {/* <Route path='/' element={</>} /> */}
                    {/* <Route path='/' element={</>} /> */}
                    {/* <Route path='/' element={</>} /> */}
                    {/* <Route path='/' element={</>} /> */}

                    {/* Fallback Route */}
                    <Route path='*' element={<NotFound/>} />
                </Routes>
            </BrowserRouter> 

            <Toaster
                position='top-center'
                toastOptions={{
                    style: {background: "linear-gradient(to left, #454545, #1a202f)", color: "white", fontSize: "15px", height: '55px', width: '400px', borderRadius: '5px', borderLeft: '10px solid #666'},
                    success: {style: { borderLeft: "10px solid #22c55e" }},
                    error: {style: { borderLeft: "10px solid #ef4444" }},
                    loading : {style: {borderLeft: "10px solid #d1d5db"}}
                }}
            />

        </ChakraProvider>
    )
}

const ProtectedHome = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <Home/>
    }
    else{
        return <Navigate to='/login' />
    }
}

const ProtectedSecurityPinReset = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <SecurityPin/>
    }
    else{
        return <Navigate to='/login' />
    }
}

const CheckLogin = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <Navigate to='/' />
    }
    else{
        return <Login/>
    }
}

const CheckSignup = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <Navigate to='/' />
    }
    else{
        return <Signup/>
    }
}

const ProtectedPasswordVault = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <PasswordVault/>
    }
    else{
        return <Navigate to='/login' />
    }
}

const ProtectedExpenseVault = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <ExpenseVault/>
    }
    else{
        return <Navigate to='/login' />
    }
}

const ProtectedDailyVault = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <DailyVault/>
    }
    else{
        return <Navigate to='/login' />
    }
}

const ProtectedTasklistVault = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <TasklistVault/>
    }
    else{
        return <Navigate to='/login' />
    }
}

const ProtectedNotesVault = () =>{
    const decodedToken = decodeToken(getAuthToken());
    if(decodedToken && decodedToken.id){
        return <NotesVault/>
    }
    else{
        return <Navigate to='/login' />
    }
}