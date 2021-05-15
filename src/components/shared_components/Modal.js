// https://css-tricks.com/hamburger-menu-with-a-side-of-react-hooks-and-styled-components/

import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../constants.js';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import useOnClickOutside from '../shared_components/hooks/useOnClickOutside.js';

/*

<Modal show={showModal} onClick={handleModalClose}>
                <ModalHeader>
                    Header
                </ModalHeader>

                <ModalBody>
                    <p>This is the body of the modal!</p>
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={() => console.log("CLICK")}>Cancel</Button>
                    <Button variant="primary">Save Changes</Button>
                </ModalFooter>
            </Modal>

*/

const GrayOutViewPort = styled.div`
    display: ${({ visible }) => visible ? 'block' : 'none'};
    opacity: 0.5; 
    background: #000; 
    width: 100%;
    height: 100%; 
    z-index: 10;
    top: 0; 
    left: 0; 
    position: fixed; 
    z-index: 2;
`;

const StyledModal = styled.div`
    position: fixed;
    display: ${({ show }) => show ? 'block' : 'none'};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${props => props.backgroundColor}
    //border: 1px solid rgba(0,0,0,.2)
    border-radius: 5px;
    width: 500px;
    z-index: 2;
`;

export const Modal = ({show, closeModalFromChild=null, backgroundColor='#FFF', children}) => {

    const closeRef = useRef();
    useOnClickOutside(closeRef, () => { if(closeModalFromChild != null) closeModalFromChild(); });

    return (
        <div>
             {/* When modal is opened */}
             <GrayOutViewPort visible={show} />

             <StyledModal ref={closeRef} show={show} backgroundColor={backgroundColor}>
            { children }
        </StyledModal>
        </div>
        
    );
}

const StyledHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    
    font-size: 24px;
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;

`;

export const ModalHeader = (props) => {
    return (
        <StyledHeader>
            { props.children }
        </StyledHeader>
    );
}

const StyledBody = styled.div`
    padding-left: 10px;
    padding-right: 10px;
`;

export const ModalBody = (props) => {
    return (
        <StyledBody>
            { props.children }
        </StyledBody>
    );
}

const StyledFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;    
    padding: 8px;
    border-top: 1px solid #dee2e6;
`;

export const ModalFooter = (props) => {

    return (
        <StyledFooter>
            { props.children }
        </StyledFooter>
    );
}

