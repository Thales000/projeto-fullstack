import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Image, Row, Col, Nav } from 'react-bootstrap'
import '../assets/Header.css'
import PerfilLogar from './PerfilLogar';
import PerfilLogado from './PerfilLogado'

function Header() {
    const location = useLocation();
    const token = localStorage.getItem('token');

    return(
        <>
            <header>
                <Container>
                    <Row>
                        <Col className="justify-content-start">
                            <Image style={{ float: 'left' }} src='https://cdn-icons-png.flaticon.com/512/588/588267.png' width="100px" height="100px" alt='Dota 2 logo'></Image>
                        </Col>
                        <Col>
                            <Nav className="justify-content-start">
                                <Nav.Item>
                                    <Link to="/buscar" className={`nav-link ${location.pathname === '/buscar' ? 'active' : ''}`}>Buscar</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/inserir" className={`nav-link ${location.pathname === '/inserir' ? 'active' : ''}`}>Inserir</Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col className="justify-content-end">
                            {token ? <PerfilLogado /> : <PerfilLogar />}
                        </Col>
                    </Row>
                </Container>
            </header>
        </>
    )

}

export default Header;