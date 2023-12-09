import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/Header.css'

function LogarPerfil() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remova o token do localStorage
        localStorage.removeItem('token');
        // Redirecione para a página de login ou outra página desejada
        navigate('/buscar');
    };

    return(
        <>
            <p>Seja bem-vindo!</p>
            <Link to="/perfil" className={`nav-link ${location.pathname === '/perfil' ? 'active' : ''}`}>Perfil/Notificações</Link>
            <p onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Desconectar
            </p>
        </>
    )

}

export default LogarPerfil;