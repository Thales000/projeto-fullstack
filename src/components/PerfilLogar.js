import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/Header.css'

function LogarPerfil() {
    const location = useLocation();

    return(
        <>
            <p>Seja bem-vindo!</p>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Logar</Link>
        </>
    )

}

export default LogarPerfil;