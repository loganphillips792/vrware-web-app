import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const List = styled.ul`
    display: flex;
    // need this to position correctly
    padding-left: 0;
    list-style: none;

`;

const Item = styled.li`
    display: block;
    background-color: ${({ currentPage, index }) => parseInt(currentPage) === parseInt(index) ? '#FFFFFF' : 'rgb(255, 255, 255, 0.6)'};
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid #dee2e6;


    span {
        // top, right, bottom, left
        padding: 8px 12px 8px 12px;
        color: #007bff;
    }

    &:hover {
        background-color: #e9ecef;
    }
`;

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalItems/itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Container>
            <List>
                {pageNumbers.map(number => (
                    <Item key={number} onClick={() => paginate(number)} index={number} currentPage={currentPage}>
                        <span>{number}</span>
                    </Item>
                ))}
            </List>
        </Container>
    )
}

export default Pagination;