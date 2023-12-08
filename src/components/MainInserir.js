import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../assets/MainInserir.css';

const MainInserir = () => {

  const [imageURL, setImageURL] = useState('');
  const [name, setName] = useState('');
  const [attr, setAttr] = useState('');
  const [attackType, setAttackType] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const hero = {
      imageURL,
      name: capitalizedName,
      attr,
      attackType
    };
  
    try {
      const response = await fetch('http://localhost:3001/register_hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hero),
      });

      console.log(hero);
  
      if (response.ok) {
        console.log('Herói inserido com sucesso!', hero);
      } else {
        console.error('Erro ao inserir herói:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao inserir herói:', error.message);
    }
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
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label>Nome do Herói</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome do herói"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Atributo do Herói</Form.Label>
            <Form.Select className='mb-5' name='attr' onChange={(e) => setAttr(e.target.value)} value={attr}>
              <option value="">Escolha o atributo do herói</option>
              <option value="all">Todos (all)</option>
              <option value="str">Força (str)</option>
              <option value="agi">Agilidade (agi)</option>
              <option value="int">Inteligência (int)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Tipo de Ataque do Herói</Form.Label>
            <Form.Select className='mb-5' name='attackType' onChange={(e) => setAttackType(e.target.value)} value={attackType}>
              <option value="">Escolha o tipo de ataque do herói</option>
              <option value="Melee">Melee</option>
              <option value="Ranged">Ranged</option>
            </Form.Select>
          </Form.Group>

          <Button variant='danger' size='lg' className='mt-3' type="submit">Inserir no banco de dados</Button>
        </Form>
      </Container>
    </main>
  );
};

export default MainInserir;