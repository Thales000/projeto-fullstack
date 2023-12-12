import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/Header.css'

function LogarPerfil() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/buscar');
    };

    return(
        <>
            <p className='smaller'>Seja bem-vindo, {decodedToken.user}!</p>
            <Link to="/perfil" className={`nav-link ${location.pathname === '/perfil' ? 'active' : ''}`}>Perfil/Notificações</Link>
            <p className='smaller' onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Desconectar
            </p>
        </>
    )

}

export default LogarPerfil;