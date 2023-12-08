import React, { useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HeroNameSearch from './HeroNameSearch';
import HeroAttrSearch from './HeroAttrSearch';
import TableData from './TableData';
import { DataContext } from '../context/DataContext';
import '../assets/MainBuscar.css'

function MainBuscar() {

    const { setData,
        setOriginalData,
        nameInputRef
    } = useContext(DataContext);
  
    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3001/get_heroes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
            .then((resp) => resp.json())
            .then((data) => {
                setData(data);
                setOriginalData(data);
            })
            .catch((err) => {
                console.log('Error: ', err);
            });
    }, []);

    return (
        <main>
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

export default MainBuscar;