import React from 'react'
import "../styles/Login.css";
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    const goToHome = () =>{
        navigate('/');
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className='login-form'>
                    <h1 className="app-title">Oops! 404</h1>
                    <h2 className="login-heading">Page Not Found</h2>
                    <h2 style={{fontSize: '16px', fontWeight: 300, textAlign: 'center', marginTop: '0', marginBottom: '10px'}}>The page you are looking for doesn't exist.</h2>
                    
                    <button onClick={goToHome} className="login-button">
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
