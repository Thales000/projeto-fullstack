import React, { useContext } from 'react';
import { Table, Image, Pagination } from 'react-bootstrap';
import { DataContext } from '../context/DataContext';
import '../assets/TableData.css'

function TableData() {
    const { 
        data,
        paginate,
        currentPage,
        itemsPerPage,
        currentItems
    } = useContext(DataContext);

    let items = [];
    for (let number = 1; number <= Math.ceil(data.length / itemsPerPage); number++) {
        items.push(
            <Pagination.Item onClick={() => paginate(number)} key={number} active={number === currentPage}>{number}</Pagination.Item>,
        );
    }

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
                    {currentItems.map(item => (
                        <tr key={item._id}>
                            <td> <Image
                                src={item.imageURL}
                                alt='hero_image'
                                thumbnail
                                style={{ maxWidth: '256px', maxHeight: '144px' }}
                            /> </td>
                            <td>{item.name}</td>
                            <td>{item.attr}</td>
                            <td>{item.attackType}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1}/>
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                {items}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(data.length / itemsPerPage)} />
                <Pagination.Last onClick={() => paginate(Math.ceil(data.length / itemsPerPage))} disabled={currentPage === Math.ceil(data.length / itemsPerPage)} />
            </Pagination>
        </>
    );
}

export default TableData;