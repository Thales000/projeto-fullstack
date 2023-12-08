import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/Header.css'

function LogarPerfil() {
    const location = useLocation();

    return(
        <>
            <p>Seja bem-vindo!</p>
            <Link to="/perfil" className={`nav-link ${location.pathname === '/perfil' ? 'active' : ''}`}>Ver Perfil/Notificações</Link>
            <p>Desconectar</p>
        </>
    )

}

export default LogarPerfil;