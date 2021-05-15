import React, { useState, useEffect, useCallback  } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { API_URL, VRWARE_ORANGE } from '../../constants.js';

// Usage Example: <Alert type="info">Check below to see metrics displayed in charts!</Alert>

const StyledAlert = styled.div`
    position: relative;
    padding: 15px 60px;
    width: 50%;
`;

const InfoAlert = styled(StyledAlert)`
    background-color: #f0f7fb;
    border-left: solid 4px #3498db;
`;

const InfoIcon = styled(FontAwesomeIcon)`
    position: absolute;
    left: 10px;
`;

// fixed bottom, fixed left, fixed right, etc as possible props?
const Alert = ({type, ...props}) => {
    switch (type) {
        case 'info':
            return <InfoAlert><InfoIcon icon={faInfo} size="2x" />{props.children}</InfoAlert>;
        default:
           return null;
    }
}

export default Alert;