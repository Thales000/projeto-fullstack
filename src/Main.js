import React, { useEffect, useContext } from 'react';
import { Button, Form, Table, Alert, Image, Container, Row, Col, ToggleButton} from 'react-bootstrap';
import { DataContext } from './DataContext';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Main.css'

function Main() {

    const { setData,
        setOriginalData,
        setInputSearch,
        setSelectedAttribute,
        isHeroChecked,
        isHeroSearchDisabled,
        isAttrChecked,
        isAttrSearchDisabled,
        isHeroButtonDisabled,
        isAttrButtonDisabled,
        handleHeroChecked,
        handleInputKeyPress,
        handleAttrChecked,
        fetchData,
        fetchDataAttr,
        inputSearch,
        data,
        error,
        nameInputRef } = useContext(DataContext);
  
    useEffect(() => {
        nameInputRef.current.focus(); // Foca o campo de pesquisa no nome do herói quando inicializado
        fetch('https://api.opendota.com/api/heroStats')
        .then((resp) => resp.json())
        .then((data) => {
            setData(data); // Define os dados iniciais
            setOriginalData(data); // Define os dados originais
        })
        .catch((err) => {
            console.log('Error: ', err);
        });
    }, [setData, setOriginalData, nameInputRef]);

    return (
        <div className="App">
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
                            <Button variant='danger' className='mt-4' onClick={fetchData} disabled={isHeroButtonDisabled}>Pesquisar</Button>
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
        </div>
    );
}

export default Main;