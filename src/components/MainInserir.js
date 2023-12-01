import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../assets/MainInserir.css';

const MainInserir = () => {

  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [attr, setAttr] = useState('');
  const [attackType, setAttackType] = useState('');

  const handleChange = (e) => {
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-5">
            <Form.Label>URL da Imagem</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite a URL da imagem"
              name="imageUrl"
              value={imageUrl}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label>Nome do Herói</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome do herói"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Atributo do Herói</Form.Label>
            <Form.Select className='mb-5' name='attribute' onChange={handleChange}>
              <option disabled>Escolha o atributo do herói</option>
              <option value="all">Todos (all)</option>
              <option value="str">Força (str)</option>
              <option value="agi">Agilidade (agi)</option>
              <option value="int">Inteligência (int)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Tipo de Ataque do Herói</Form.Label>
            <Form.Select className='mb-5' name='attackType' onChange={handleChange}>
              <option disabled>Escolha o tipo de ataque do herói</option>
              <option value="melee">Melee</option>
              <option value="ranged">Ranged</option>
            </Form.Select>
          </Form.Group>

          <Button variant='danger' size='lg' className='mt-3' type="submit">Inserir no banco de dados</Button>
        </Form>
      </Container>
    </main>
  );
};

export default MainInserir;