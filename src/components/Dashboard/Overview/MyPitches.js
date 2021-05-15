import React from 'react';
import styled from 'styled-components';
import MyPitchItem from './MyPitchItem.js';

const StyledMyPitches = styled.div`
    background-color: rgb(255, 255, 255, 0.1my);
	box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.19);
    border-radius: 15px;
	border: 1px solid white;
	margin: 10px;
`;

const MyPitches = ({audioFiles, setRefreshFromChild}) => {
    return (
        <StyledMyPitches>
            {
                audioFiles.map((pitch, index) => (
                    <MyPitchItem key={index} pitch={pitch} index={index} currentIndex={index+1} numberOfItemsInList={audioFiles.length} setRefreshFromChild={setRefreshFromChild} />
                ))
            }
        </StyledMyPitches>
    );
}

export default MyPitches;