import React, { useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import useOnClickOutside from '../shared_components/hooks/useOnClickOutside.js';


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

const StyledMetricsExplanationModal = styled.div`
    display: ${({visible}) => visible ? 'block': 'none'};
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 250px;
    overflow-y: auto;
    padding:20px;
    margin-top:20px;
    background-color:rgba(255,255,255);
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    border-radius:3px;
    -webkit-box-shadow: 0px 0px 2px #888888;
    -moz-box-shadow: 0px 0px 2px #888888;
    box-shadow: 0px 0px 2px #888888;
    // on top of <GrayOutViewPort />
    z-index: 3;

    ul {
        list-style-type: none;
    }
`;

const CloseIcon = styled(FontAwesomeIcon)`
    cursor: pointer;

    &:hover {
        color: red;
    }

`;

const MetricsExplanationModal = ({visible, closeModalFromChild}) => {

    const closeRef = useRef();
    useOnClickOutside(closeRef, () => closeModalFromChild());

    return (
        <div>
            <GrayOutViewPort visible={visible} />
            <StyledMetricsExplanationModal visible={visible} ref={closeRef}>
            <CloseIcon icon={faTimes} size="2x" onClick={() => closeModalFromChild()} />
                <ul>
                    <li>
                        <b>Pronunciation posteriori score</b>
                        <ul>
                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</li>
                        </ul>
                    </li>
                    <li>
                        <b>Filler words and pauses</b>
                        <ul>
                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</li>
                        </ul>
                    </li>
                    <li>
                        <b>Rate of Speech</b>
                        <ul>
                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</li>
                        </ul>
                    </li>
                    <li>
                        <b>Ratio between speaking duration and total audio length</b>
                        <ul>
                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</li>
                        </ul>
                    </li>
                    <li>
                        <b>Total duration</b>
                        <ul>
                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</li>
                        </ul>
                    </li>
                </ul>
            </StyledMetricsExplanationModal>
        </div>
        
    )
}

export default MetricsExplanationModal;