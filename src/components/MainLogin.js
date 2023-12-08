import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../assets/MainLogin.css';

const MainLogin = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    console.log('User:' , user);
    console.log('Password:', password);

    try {
      const response = await fetch('http://localhost:3001/search_user', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user, password }),
      });

      if (response.ok) {
          const data = await response.json();
          const token = data.token;

        console.log("Token LocalStorage: ", token);
          //Armazenar o token em localStorage
          localStorage.setItem('token', token);
      } else {
          const errorData = await response.json();
          alert(`Erro: ${errorData.message}`);
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

                <Button variant="primary btn-danger" type="submit" className='my-4'>
                Entrar
                </Button>
            </Form>
            </Col>
        </Row>
        </Container>
    </main>
  );
};

export default MainLogin;