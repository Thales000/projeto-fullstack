import { Container, Image, Row, Col } from 'react-bootstrap'
import './Header.css'

function Header() {

    return(
        <>
            <header>
                <Container>
                    <Row>
                        <Col>
                            <Image src='https://cdn-icons-png.flaticon.com/512/588/588267.png' width="100px" height="100px" alt='Dota 2 logo'></Image>
                        </Col>
                        <Col>
                            <p>DOTA 2 API</p>
                        </Col>
                        <Col>
                            <div></div>
                        </Col>
                    </Row>
                </Container>
            </header>
        </>
    )

}

export default Header;