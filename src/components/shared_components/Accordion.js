import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { AccordionContext } from './Context.js';

// good way to design strcuture: https://www.npmjs.com/package/react-accessible-accordion

const StyledAccordionContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    box-shadow: 0 4px 4px -2px rgba(0,0,0,0.5);
    border-radius: 8px;
    // need this for the border radius
    overflow: hidden;
    //margin: -1px 0;
    //width: 50%;
    // select all first level children (all accordions)
    & > * {
        //flex-basis: 30%;
        //margin: 1px 0;
    }
`;

export const AccordionContainer = ({ children }) => {
    return (
        <StyledAccordionContainer>
            {children}
        </StyledAccordionContainer>
    );
}

const StyledAccordion = styled.div`
    // so 'AccordionArrow' can be positioned absolutely
    position: relative;
    color: #444;
    border: none;
    outline: none;
    //border: 1px solid rgba(0, 0, 0, .125);
`;

export const Accordion = ({ children }) => {
    const [showCollapsible, setShowCollapsible] = useState(false);

    return (
        <AccordionContext.Provider value={{showCollapsible, setShowCollapsible}}>
        <StyledAccordion>
            { children }
        </StyledAccordion>
        </AccordionContext.Provider>
    );
}

const StyledAccordionHeading = styled.div`
    // so Date, .audio_number could be positioned absolutely
    position: relative;
    padding: 25px;
    color: #ECF0F1;
    background-color: ${props => props.show ? '#11181f' : '#2C3E50'};
    cursor: pointer;

    &:hover {
        background-color: #1A252F;
    }

    .date {
        position: absolute;
        left: 5px;
        bottom: 0;
        display: inline-block;
        font-size: 80%;
    }

    .audio_number {
        position: absolute;
        display: inline-block;
        right: 50px;
    }

    .link-to-pitch-container {
        display: flex;
        justify-content: center;
    }
`;

export const AccordionHeading = ({ expandDownIcon, expandUpIcon, children }) => {

    const { showCollapsible, setShowCollapsible } = useContext(AccordionContext);

    let showPreview = () => {
    }

    return (
        <StyledAccordionHeading show={showCollapsible} onMouseEnter={showPreview} onClick={() => setShowCollapsible(!showCollapsible)}>
            {showCollapsible ? (
                <span>{ expandDownIcon }</span>
            ) : (
                <span>{ expandUpIcon }</span>
            )}

            {children}
        </StyledAccordionHeading>
    );
}

const StyledAccordionBody = styled.div`
    //display: ${props => props.show ? 'block' : 'none'};
    // https://stackoverflow.com/a/8331169
    max-height: ${props => props.show ? '300px' : '0px'};
    transition: max-height 0.35s ease;
    #overflow: hidden;
    overflow-y: auto;
    background-color: #fff;
`;

export const AccordionBody = ({ children }) => {

    const { showCollapsible, setShowCollapsible } = useContext(AccordionContext);

    return (
        <StyledAccordionBody show={showCollapsible}>
            {children}
        </StyledAccordionBody>
    );
}   