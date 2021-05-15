import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const StyledNavBar = styled.div`
    display: flex;
    padding: 10px;
	margin-top: 20px;
	margin-bottom: 40px;
    top: 60px;

    div {
        text-align: center;
        padding: 30px;
        margin: 5px;
        border-radius: 10px;
        flex-basis: 33%;
        font-family: "Open Sans", sans-serif;
        font-size: 25px;
        font-weight: 700;
        color: #000000;
        background-color: rgb(0, 0, 0, 0.12); 
        cursor: pointer;

        &:hover {
            background-color: rgb(0, 0, 0, 0.2);
        }
    }

    div:first-child {
        border-bottom: ${props => props.selected === 'overview' && '4px solid #595959'};
        background-color: ${props => props.selected === 'overview' && 'rgb(0, 0, 0, 0.2)'};
    }

    div:nth-child(2) {
        border-bottom: ${props => props.selected === 'speech' && '4px solid #595959'};
        background-color: ${props => props.selected === 'speech' && 'rgb(0, 0, 0, 0.2)'};
    }

    div:nth-child(3) {
        border-bottom: ${props => props.selected === 'movement' && '4px solid #595959'};
        background-color: ${props => props.selected === 'movement' && 'rgb(0, 0, 0, 0.2)'};
    }
`;

const HorizontalNavBar = () => {
    const [selected, setSelected] = useState('overview');
    
    const history = useHistory();

    return (
        <StyledNavBar selected={selected}>
            <div onClick={() => { setSelected('overview'); history.push("/dashboard/overview")} }>
                <span>Overview</span>
            </div>
            <div onClick={() =>  { setSelected('speech'); history.push("/dashboard/speech") }}>
                <span>Speech</span>
            </div>
            <div onClick={() => { setSelected('movement'); history.push("/dashboard/movement") }}>
                <span>Movement</span>
            </div>
        </StyledNavBar>
    );
}

export default HorizontalNavBar;