import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../assets/Main.css';

const MainInserir = () => {

  const [imageURL, setImageURL] = useState('');
  const [name, setName] = useState('');
  const [attr, setAttr] = useState('');
  const [attackType, setAttackType] = useState('');
  const [inserirError, setInserirError] = useState(null);
  const [inserirSuccess, setInserirSuccess] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setInserirError(null);
    setInserirSuccess(null);

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const hero = {
      imageURL,
      name: capitalizedName,
      attr,
      attackType
    };
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3001/register_hero', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(hero),
      });

  
      if (response.ok) {

        setInserirSuccess(`Herói ${hero.name} inserido com sucesso!`);
        
        setImageURL('');
        setName('');
        setAttr('');
        setAttackType('');
      } else {
        const errorData = await response.json();
        if (!token) {
          setInserirError("Faça login no site primeiro para poder inserir o herói");
        } else if (errorData.error === "Sem URL") {
          setInserirError("Campo da URL da imagem precisa ser preenchida");
        } else if (errorData.error === "Sem nome") {
          setInserirError("Campo do nome do herói precisa ser preenchido");
        } else if (errorData.error === "Sem atributo") {
          setInserirError("Campo do atributo do herói precisa ser preenchido");
        } else if (errorData.error === "Sem tipo de ataque") {
          setInserirError("Campo do tipo de ataque do herói precisa ser preenchido");
        } else {
          console.log(`Erro: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error('Erro ao inserir herói:', error.message);
    }
  };
  
  return (
    <main>
      <Container className='container-sm'>
        {inserirError && <Alert className='mb-5 alert-sm' variant="danger">{inserirError}</Alert>}
        {inserirSuccess && <Alert className='mb-5 alert-sm' variant="success">{inserirSuccess}</Alert>}
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