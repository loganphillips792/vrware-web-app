import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const Spinner = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;

// https://projects.lukehaas.me/css-loaders/
const StyledCircleSpinner = styled(Spinner)`

  .loading {
    margin: 60px auto;
    font-size: 10px;
    text-indent: -9999em;
    border-top: 1.1em solid rgba(255,153,34, 0.2);
    border-right: 1.1em solid rgba(255,153,34, 0.2);
    border-bottom: 1.1em solid rgba(255,153,34, 0.2);
    border-left: 1.1em solid #ff9922;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
  
    &, 
    &:after {
      border-radius: 50%;
      width: 10em;
      height: 10em;
    }
  
    @-webkit-keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
  }

  span {
    color: #FFFFFF;
    z-index: 2;
  }
`;

// https://tobiasahlin.com/spinkit/
const StyledDoubleBounceSpinner = styled(Spinner)`
  width: 40px;
  height: 40px;
  
  .double-bounce1, .double-bounce2 {
    
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #7DB0DB;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    
    -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
    animation: sk-bounce 2.0s infinite ease-in-out;
  }

  .double-bounce2 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  @-webkit-keyframes sk-bounce {
    0%, 100% { -webkit-transform: scale(0.0) }
    50% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bounce {
    0%, 100% { 
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 50% { 
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
    }
  }
`;

const DisablesScroll = createGlobalStyle`
  body {
    overflow-y: hidden;
  }
`

export const CircleSpinner = () => {
    return (
      <StyledCircleSpinner>
        <DisablesScroll />
        <div class="loading">
          asdfasdf
        </div>
        <span>Uploading audio...</span>
      </StyledCircleSpinner>
    )
}

export const DoubleBounceSpinner = () => {
  return (
    <StyledDoubleBounceSpinner>
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </StyledDoubleBounceSpinner>
  );
} 