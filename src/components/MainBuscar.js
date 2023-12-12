import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HeroNameSearch from './HeroNameSearch';
import HeroAttrSearch from './HeroAttrSearch';
import TableData from './TableData';
import '../assets/Main.css'

function MainBuscar() {

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