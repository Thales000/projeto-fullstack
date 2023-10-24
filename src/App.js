import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Table, Alert, Image } from 'react-bootstrap';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Header from './Header';

function App() {
  const nameInputRef = useRef(null);
  const [inputSearch, setInputSearch] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    nameInputRef.current.focus();
    fetch('https://api.opendota.com/api/heroStats')
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
        setOriginalData(data);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  }, []);

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (inputSearch.length < 2) {
      setError('Para dados mais específicos, digite pelo menos 2 letras');
      setData(originalData);
      fetchData();
      return;
    }
    setError(null);
    fetchData();
  };

  const fetchData = () => {
    fetch('https://api.opendota.com/api/heroStats')
      .then(resp => resp.json())
      .then(data => {
        if(inputSearch.length < 2) {
          return
        }
        const formattedSearch = inputSearch.charAt(0).toUpperCase() + inputSearch.slice(1).toLowerCase();
        const filteredData = data.filter(hero => hero.localized_name.includes(formattedSearch));
        setData(filteredData);
      })
      .catch(err => {
        console.log('Error: ', err);
      });
  };

  return (
    <div className="App">
      <Header />
      <main className="App-header">
        <Form>
          <Form.Group>
            <Form.Label>Heroi</Form.Label>
            <Form.Control
              type='text'
              size='lg'
              placeholder='Escolha o nome do heroi'
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={handleInputKeyPress}
              ref={nameInputRef}
            />
          <Button className='mt-3' onClick={handleSearch}>Pesquisar</Button>
          {error && <Alert className='mt-3 alert-sm' variant="danger">{error}</Alert>}
          </Form.Group>
        </Form>
        
        <Table variant='dark' className='mt-5' striped bordered hover>
          <thead>
            <tr>
              <th>Ícone</th>
              <th>Nome</th>
              <th>Attributo Principal</th>
              <th>Ataque</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td> <Image src={'https://api.opendota.com'+item.img} alt='localized_name' thumbnail /> </td>
                <td>{item.localized_name}</td>
                <td>{item.primary_attr}</td>
                <td>{item.attack_type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </main>
      <Footer />
    </div>
  );
}

export default App;