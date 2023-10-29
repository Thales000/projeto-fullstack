import React, { useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HeroNameSearch from './HeroNameSearch';
import HeroAttrSearch from './HeroAttrSearch';
import TableData from './TableData';
import { DataContext } from './DataContext';
import './Main.css'

function Main() {

    const { setData,
        setOriginalData,
        nameInputRef
    } = useContext(DataContext);
  
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
        <main className="App-header">
            <Container>
                <Row>
                    <Col>
                        <HeroNameSearch />
                    </Col>
                    <Col>
                        <div></div>
                    </Col>
                    <Col>
                        <HeroAttrSearch />
                    </Col>
                </Row>
            </Container>
            <TableData />
        </main>
    );
}

export default Main;