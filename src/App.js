import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Table, Alert, Image, Container, Row, Col, ToggleButton} from 'react-bootstrap';
import Footer from './Footer';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

function App() {
  const nameInputRef = useRef(null);
  const [inputSearch, setInputSearch] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isHeroChecked, setIsHeroChecked] = useState(true);
  const [isHeroSearchDisabled, setIsHeroSearchDisabled] = useState(false);
  const [isHeroButtonDisabled, setIsHeroButtonDisabled] = useState(false);
  const [isAttrChecked, setIsAttrChecked] = useState(false);
  const [isAttrSearchDisabled, setIsAttrSearchDisabled] = useState(true);
  const [isAttrButtonDisabled, setIsAttrButtonDisabled] = useState(true);

  useEffect(() => {
    nameInputRef.current.focus();
    fetch('https://api.opendota.com/api/heroStats')
      .then((resp) => resp.json())
      .then((data) => {
        setData(data); // Define os dados iniciais
        setOriginalData(data); // Define os dados originais
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  }, []);

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleHeroSearch();
    }
  };

  const handleHeroSearch = () => {
    // Verificação de preenchimento de campo obrigatório
    if (inputSearch.length < 2) {
      setError('Para dados mais específicos, digite pelo menos 2 letras');
      setData(originalData);
      fetchData();
      return;
    }
    // Limpa erros anteriores, se houver
    setError(null);
    // Realiza a busca
    fetchData();
  };

  const handleHeroChecked = () => {
    setIsHeroChecked(true);
    setIsAttrChecked(false);
    setIsHeroSearchDisabled(false); // Desabilita o campo de pesquisa
    setIsHeroButtonDisabled(false);
    setIsAttrSearchDisabled(true); // Desabilita o campo de pesquisa
    setIsAttrButtonDisabled(true);
  }

  const handleAttrChecked = () => {
    setInputSearch('');
    setError(null);
    setIsHeroChecked(false);
    setIsAttrChecked(true);
    setIsAttrSearchDisabled(false); // Desabilita o campo de pesquisa
    setIsAttrButtonDisabled(false);
    setIsHeroSearchDisabled(true); // Desabilita o campo de pesquisa
    setIsHeroButtonDisabled(true);
  }

  const fetchData = () => {
    fetch('https://api.opendota.com/api/heroStats')
      .then(resp => resp.json())
      .then(data => {
        if(inputSearch.length < 2) {
          return
        }
        const formattedSearch = inputSearch.charAt(0).toUpperCase() + inputSearch.slice(1).toLowerCase();
        // Filtra os dados com base em inputSearch
        const filteredData = data.filter(hero => hero.localized_name.includes(formattedSearch));
        setData(filteredData);
      })
      .catch(err => {
        console.log('Error: ', err);
      });
  };

  const fetchDataAttr = () => {
    fetch('https://api.opendota.com/api/heroStats')
      .then(resp => resp.json())
      .then(data => {
        if(selectedAttribute === '-'){
          setData(originalData);
          return
        }
        const filteredData = data.filter(attr => attr.primary_attr.includes(selectedAttribute));
        setData(filteredData);
      })
      .catch(err => {
        console.log('Error: ', err);
      });
  }

  return (
    <div className="App">
      <Header />
      <main className="App-header">
        <Container>
          <Form className='mt-4'>
            <Row>
              <Col>
                <Form.Group>
                  <ToggleButton
                    id="toggle-check-hero"
                    type="checkbox"
                    variant="outline-danger"
                    checked={isHeroChecked}
                    value="1"
                    onChange={handleHeroChecked}
                  >
                    Escolher por herói
                  </ToggleButton>
                  <Form.Control
                    type='text'
                    size='lg'
                    className='mt-3'
                    placeholder='Escolha o nome do herói'
                    value={inputSearch}
                    onChange={(e) => setInputSearch(e.target.value)}
                    onKeyDown={handleInputKeyPress}
                    ref={nameInputRef}
                    disabled={isHeroSearchDisabled}
                  />
                  <Button variant='danger' className='mt-4' onClick={handleHeroSearch} disabled={isHeroButtonDisabled}>Pesquisar</Button>
                  {error && <Alert className='mt-4 alert-sm' variant="danger">{error}</Alert>}
                </Form.Group>
              </Col>

              <Col>
                <div></div>
              </Col>

              <Col>
                <ToggleButton
                  id="toggle-check-attr"
                  type="checkbox"
                  variant="outline-danger"
                  checked={isAttrChecked}
                  value="1"
                  onChange={handleAttrChecked}
                >
                  Escolher por atributo
                </ToggleButton>
                <Form.Select className='mt-3' size='lg' aria-label="Default select example" onChange={(e) => setSelectedAttribute(e.target.value)} disabled={isAttrSearchDisabled} >
                  <option value="-">Escolha o atributo do herói</option>
                  <option value="all">Todos (all)</option>
                  <option value="str">Força (str)</option>
                  <option value="agi">Agilidade (agi)</option>
                  <option value="int">Inteligência (int)</option>
                </Form.Select>
                <Button variant='danger' className='mt-4' onClick={fetchDataAttr} disabled={isAttrButtonDisabled} >Pesquisar</Button>
              </Col>
            </Row>
          </Form>
        </Container>
        
        <Table variant='dark' className='mt-5' striped bordered hover>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Atributo Principal</th>
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