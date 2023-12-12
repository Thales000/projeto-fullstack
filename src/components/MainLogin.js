import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Main.css';

const MainLogin = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setUserError(null);

    console.log('User:' , user);
    console.log('Password:', password);

    try {
        const token = localStorage.getItem('token');
        console.log("Token antes da requisição: ", token);

        const response = await fetch('http://localhost:3001/search_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;

            console.log("Token LocalStorage: ", token);
            //Armazenar o token em localStorage
            localStorage.setItem('token', token);

            navigate('/buscar');
            
        } else if (response.status === 429) {
            const errorData = await response.json();
            setUserError(errorData.error);
        } else {
            const errorData = await response.json();
            if (errorData.error === "Senha incorreta") {
                setPasswordError("Senha incorreta. Tente novamente.");
            } else if (errorData.error === "Usuário não encontrado") {
                setUserError("Usuário não encontrado. Verifique o nome de usuário.");
            } else {
                console.log(`Erro: ${errorData.message}`);
            }
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error.message);
    }
  };

  return (
    <main>
        <Container>
        <Row className="justify-content-center">
            <Col md={6}>
            <h1 className="text-center mb-5">Login</h1>
            <Form onSubmit={handleUserSubmit}>
                
                <Form.Group>
                <Form.Label>Usuário</Form.Label>
                <Form.Control
                    className="mt-1 mb-3"
                    type="user"
                    placeholder="Seu usuário"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                />
                </Form.Group>
                {userError && <Alert className='my-3 alert-sm' variant="danger">{userError}</Alert>}

                <Form.Group>
                <Form.Label>Senha</Form.Label>
                <Form.Control
                    className="mt-1 mb-3"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </Form.Group>
                {passwordError && <Alert className='my-3 alert-sm' variant="danger">{passwordError}</Alert>}

                <Button variant="primary btn-danger" type="submit" className='my-4'>
                Entrar
                </Button>

                <p>Não tem uma conta? <Link to="/cadastro" className='nav-link'>Criar</Link></p>
            </Form>
            </Col>
        </Row>
        </Container>
    </main>
  );
};

export default MainLogin;