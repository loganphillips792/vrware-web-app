import React, { useState, useEffect, useCallback,  } from 'react';
import styled, { css } from 'styled-components';
import { VRWARE_ORANGE } from '../../constants.js';

// https://freshdesignweb.com/css3-buttons/
const StyledJellyButton = styled.div`
    background: ${props => props.color};
    border-radius: 100px;
    padding: 20px 60px;
    color: #fff;
    text-decoration: none;
    //font-size: 1.45em;
    margin: 0 15px;
    width: 250px;
    cursor: pointer;
    // center props.children
    text-align: center;

    &:hover {
        -webkit-animation: hover 1200ms linear 2 alternate;
        animation: hover 1200ms linear 2 alternate;
    }

    &:active {
        -webkit-animation: active 1200ms ease 1 alternate;
        animation: active 1200ms ease 1 alternate; 
        background: ${props => props.activeColor};

       // background: #5F9BE0;'
    }

    /* Active state animation keyframes below */

    @-webkit-keyframes active { 
        0% {transform: scale(1,1);}
        90% {transform: scale(.9,.88);}
        100% {transform: scale(.92,.9);}
    }

    keyframes active { 
        0% {transform: scale(1,1);}
        90% {transform: scale(.9,.88);}
        100% {transform: scale(.92,.9);}
    }

    /* Hover state animation keyframes below */

    @-webkit-keyframes hover { 
        0% { -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        1.8% { -webkit-transform: matrix3d(1.016, 0, 0, 0, 0, 1.037, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.016, 0, 0, 0, 0, 1.037, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        3.5% { -webkit-transform: matrix3d(1.033, 0, 0, 0, 0, 1.094, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.033, 0, 0, 0, 0, 1.094, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        4.7% { -webkit-transform: matrix3d(1.045, 0, 0, 0, 0, 1.129, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.045, 0, 0, 0, 0, 1.129, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        5.31% { -webkit-transform: matrix3d(1.051, 0, 0, 0, 0, 1.142, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.051, 0, 0, 0, 0, 1.142, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        7.01% { -webkit-transform: matrix3d(1.068, 0, 0, 0, 0, 1.158, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.068, 0, 0, 0, 0, 1.158, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        8.91% { -webkit-transform: matrix3d(1.084, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.084, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        9.41% { -webkit-transform: matrix3d(1.088, 0, 0, 0, 0, 1.132, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.088, 0, 0, 0, 0, 1.132, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        10.71% { -webkit-transform: matrix3d(1.097, 0, 0, 0, 0, 1.107, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.097, 0, 0, 0, 0, 1.107, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        12.61% { -webkit-transform: matrix3d(1.108, 0, 0, 0, 0, 1.077, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.108, 0, 0, 0, 0, 1.077, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        14.11% { -webkit-transform: matrix3d(1.114, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.114, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        14.41% { -webkit-transform: matrix3d(1.115, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.115, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        16.32% { -webkit-transform: matrix3d(1.119, 0, 0, 0, 0, 1.077, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.119, 0, 0, 0, 0, 1.077, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        18.12% { -webkit-transform: matrix3d(1.121, 0, 0, 0, 0, 1.096, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.121, 0, 0, 0, 0, 1.096, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        18.72% { -webkit-transform: matrix3d(1.121, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.121, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        20.02% { -webkit-transform: matrix3d(1.121, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.121, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        21.82% { -webkit-transform: matrix3d(1.119, 0, 0, 0, 0, 1.119, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.119, 0, 0, 0, 0, 1.119, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        24.32% { -webkit-transform: matrix3d(1.115, 0, 0, 0, 0, 1.11, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.115, 0, 0, 0, 0, 1.11, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        25.53% { -webkit-transform: matrix3d(1.113, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.113, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        29.23% { -webkit-transform: matrix3d(1.106, 0, 0, 0, 0, 1.089, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.106, 0, 0, 0, 0, 1.089, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        29.93% { -webkit-transform: matrix3d(1.105, 0, 0, 0, 0, 1.09, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.105, 0, 0, 0, 0, 1.09, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        35.54% { -webkit-transform: matrix3d(1.098, 0, 0, 0, 0, 1.105, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.098, 0, 0, 0, 0, 1.105, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        36.64% { -webkit-transform: matrix3d(1.097, 0, 0, 0, 0, 1.106, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.097, 0, 0, 0, 0, 1.106, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        41.04% { -webkit-transform: matrix3d(1.096, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.096, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        44.04% { -webkit-transform: matrix3d(1.096, 0, 0, 0, 0, 1.097, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.096, 0, 0, 0, 0, 1.097, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        51.45% { -webkit-transform: matrix3d(1.099, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.099, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        52.15% { -webkit-transform: matrix3d(1.099, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.099, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        58.86% { -webkit-transform: matrix3d(1.101, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.101, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        63.26% { -webkit-transform: matrix3d(1.101, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.101, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        66.27% { -webkit-transform: matrix3d(1.101, 0, 0, 0, 0, 1.101, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.101, 0, 0, 0, 0, 1.101, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        73.77% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        81.18% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        85.49% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        88.59% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        96% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        100% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } 
    }

    @keyframes hover { 
        0% { -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        1.8% { -webkit-transform: matrix3d(1.016, 0, 0, 0, 0, 1.037, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.016, 0, 0, 0, 0, 1.037, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        3.5% { -webkit-transform: matrix3d(1.033, 0, 0, 0, 0, 1.094, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.033, 0, 0, 0, 0, 1.094, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        4.7% { -webkit-transform: matrix3d(1.045, 0, 0, 0, 0, 1.129, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.045, 0, 0, 0, 0, 1.129, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        5.31% { -webkit-transform: matrix3d(1.051, 0, 0, 0, 0, 1.142, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.051, 0, 0, 0, 0, 1.142, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        7.01% { -webkit-transform: matrix3d(1.068, 0, 0, 0, 0, 1.158, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.068, 0, 0, 0, 0, 1.158, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        8.91% { -webkit-transform: matrix3d(1.084, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.084, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        9.41% { -webkit-transform: matrix3d(1.088, 0, 0, 0, 0, 1.132, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.088, 0, 0, 0, 0, 1.132, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        10.71% { -webkit-transform: matrix3d(1.097, 0, 0, 0, 0, 1.107, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.097, 0, 0, 0, 0, 1.107, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        12.61% { -webkit-transform: matrix3d(1.108, 0, 0, 0, 0, 1.077, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.108, 0, 0, 0, 0, 1.077, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        14.11% { -webkit-transform: matrix3d(1.114, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.114, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        14.41% { -webkit-transform: matrix3d(1.115, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.115, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        16.32% { -webkit-transform: matrix3d(1.119, 0, 0, 0, 0, 1.077, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.119, 0, 0, 0, 0, 1.077, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        18.12% { -webkit-transform: matrix3d(1.121, 0, 0, 0, 0, 1.096, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.121, 0, 0, 0, 0, 1.096, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        18.72% { -webkit-transform: matrix3d(1.121, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.121, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        20.02% { -webkit-transform: matrix3d(1.121, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.121, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        21.82% { -webkit-transform: matrix3d(1.119, 0, 0, 0, 0, 1.119, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.119, 0, 0, 0, 0, 1.119, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        24.32% { -webkit-transform: matrix3d(1.115, 0, 0, 0, 0, 1.11, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.115, 0, 0, 0, 0, 1.11, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        25.53% { -webkit-transform: matrix3d(1.113, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.113, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        29.23% { -webkit-transform: matrix3d(1.106, 0, 0, 0, 0, 1.089, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.106, 0, 0, 0, 0, 1.089, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        29.93% { -webkit-transform: matrix3d(1.105, 0, 0, 0, 0, 1.09, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.105, 0, 0, 0, 0, 1.09, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        35.54% { -webkit-transform: matrix3d(1.098, 0, 0, 0, 0, 1.105, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.098, 0, 0, 0, 0, 1.105, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        36.64% { -webkit-transform: matrix3d(1.097, 0, 0, 0, 0, 1.106, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.097, 0, 0, 0, 0, 1.106, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        41.04% { -webkit-transform: matrix3d(1.096, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.096, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        44.04% { -webkit-transform: matrix3d(1.096, 0, 0, 0, 0, 1.097, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.096, 0, 0, 0, 0, 1.097, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        51.45% { -webkit-transform: matrix3d(1.099, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.099, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        52.15% { -webkit-transform: matrix3d(1.099, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.099, 0, 0, 0, 0, 1.102, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        58.86% { -webkit-transform: matrix3d(1.101, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.101, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        63.26% { -webkit-transform: matrix3d(1.101, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.101, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        66.27% { -webkit-transform: matrix3d(1.101, 0, 0, 0, 0, 1.101, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.101, 0, 0, 0, 0, 1.101, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        73.77% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        81.18% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        85.49% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        88.59% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        96% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
        100% { -webkit-transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.1, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } 
}
`;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring
export const JellyButton = ({color = '#76B3FA', activeColor='#5F9BE0', children}) => {

    return (
        <StyledJellyButton color={color} activeColor={activeColor}>
            {children}
        </StyledJellyButton>
    );
}

const StyledButton = styled.div`
    cursor: pointer;
    color: #FFF;
    border: 1px solid transparent;
    padding: 6px 12px;
    font-size: 1rem;
    border-radius: .25rem;
`;

const PrimaryButton = styled(StyledButton)`
    ${function(props) {
        if(props.disable) {
            return css`
                background-color: #6c757d;
                pointer-events: none;
            `
        } else {
            return css`
                background-color: #007BFF;
                &:hover {
                    background-color: #005EC4;
                }
            `
        }
    }}
`;

const SecondaryButton = styled(StyledButton)`
    background-color: #6c757d;

    &:hover {
        background-color: #343a40;
    }
`;

const DangerButton = styled(StyledButton)`
    ${function(props) {
        if(props.disable) {
            return css`
                background-color: #6c757d;
                pointer-events: none;
            `
        } else {
            return css`
                background-color: #dc3545;
                &:hover {
                    background-color: #B02A37;
                }
            `
        }
    }}
`

export const Button = ({ variant, onClick=null, children, disable=false }) => {
    switch (variant) {
        case 'primary':
            return <PrimaryButton onClick={onClick} disable={disable}>{ children }</PrimaryButton>;
        case 'secondary':
            return <SecondaryButton onClick={onClick} disable={disable}>{ children }</SecondaryButton>;
        case 'danger':
            return <DangerButton onClick={onClick} disable={disable}>{ children }</DangerButton>;
        default:
            return null;
    }
}

// https://codepen.io/RazorXio/pen/gMaoOW
const StyledOnHoverSlideButton = styled.div`
    color: ${props => props.textColor};
    border: 2px solid ${props => props.backgroundColor};
    border-radius: 0px;
    padding: 18px 36px;
    display: inline-block;
    font-family: "Lucida Console", Monaco, monospace;
    font-size: 14px;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: inset 0 0 0 0 ${props => props.backgroundColor};
    -webkit-transition: ease-out 0.4s;
    -moz-transition: ease-out 0.4s;
    transition: ease-out 0.4s;

    &:hover {
        box-shadow: inset 400px 0 0 0 ${props => props.backgroundColor};
    }

`;

export const OnHoverSlideButton = ({ slideDirection, position=null, textColor='#000000', backgroundColor=VRWARE_ORANGE, children }) => {
    switch (slideDirection) {
        case 'right':
            return <StyledOnHoverSlideButton slideDirection={slideDirection} textColor={textColor} backgroundColor={backgroundColor}>{ children }</StyledOnHoverSlideButton>
        default: 
            return null;
    }
}