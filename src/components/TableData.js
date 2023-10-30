import React, { useContext } from 'react';
import { Table, Image } from 'react-bootstrap';
import { DataContext } from '../context/DataContext';
import '../assets/TableData.css'

function HeroTable() {
    const { data } = useContext(DataContext);

    return (
        <>
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
                            <td> <Image src={'https://api.opendota.com' + item.img} alt='localized_name' thumbnail /> </td>
                            <td>{item.localized_name}</td>
                            <td>{item.primary_attr}</td>
                            <td>{item.attack_type}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default HeroTable;