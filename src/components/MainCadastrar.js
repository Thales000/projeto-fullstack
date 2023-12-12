import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Main.css';

const MainCadastrar = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [userError, setUserError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [registerSuccess, setRegisterSuccess] = useState(null);
    const navigate = useNavigate();

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setUserError(null);
        setPasswordError(null);
        setRegisterSuccess(null);

        if(password !== password2){
            setPasswordError("Senhas diferentes, tente novamente");
            setPassword('');
            setPassword2('');
            return
        }

        try {
            const response = await fetch('http://localhost:3001/register_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                setRegisterSuccess(`Usuário ${user} cadastrado com sucesso!`);
            } else {
                const errorData = await response.json();
                setUserError("Usuário já existente");
                console.error(`Erro: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error.message);
            console.log('Resposta completa:', await error.response.text());
        }
    };

    return (
        <main>
        <Container>
            {registerSuccess && <Alert className='mb-5 alert-sm' variant="success">{registerSuccess}</Alert>}
            <Row className="justify-content-center">
            <Col md={6}>
                <h1 className="text-center mb-5">Cadastro</h1>
                <Form onSubmit={handleRegisterSubmit}>
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

                <Form.Group>
                    <Form.Label>Repetir Senha</Form.Label>
                    <Form.Control
                    className="mt-1 mb-3"
                    type="password"
                    placeholder="Repita sua senha"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                />
                </Form.Group>
                {passwordError && <Alert className='my-3 alert-sm' variant="danger">{passwordError}</Alert>}

                <Button variant="primary btn-danger" type="submit" className='my-4'>
                    Cadastrar
                </Button>
                </Form>
                <Link to="/login" className='nav-link'>Voltar para o Login</Link>
            </Col>
            </Row>
        </Container>
        </main>
    );
};

export default MainCadastrar;