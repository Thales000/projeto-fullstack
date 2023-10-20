import React from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Form>
          <Form.Group>
            <Form.Label>Heroi:</Form.Label>
            <Form.Control type='text' size='lg' placeholder='Escolha o nome do heroi'></Form.Control>
          </Form.Group>
        </Form>
        <Button className='mt-3'>Pesquisar</Button>
      </header>
    </div>
  );
}

export default App;
