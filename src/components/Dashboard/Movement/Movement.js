import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../constants.js';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
import SelectPitchTopic from '../../shared_components/SelectPitchTopic.js';


const Container = styled.div`
`;

const Movement = () => {
    const selectedPitchTopic = useStoreState(store => store.selectedPitchTopic);

    if(Object.keys(selectedPitchTopic.pitchTopic).length === 0 && selectedPitchTopic.pitchTopic.constructor === Object) {
        return <SelectPitchTopic />
    }

    return (
        <Container>
            {/* <HorizontalNavBar /> */}
            <h1>Movement for {selectedPitchTopic.pitchTopic.name}</h1>
            {/* {JSON.stringify(selectedPitchTopic.pitchTopic)} */}
        </Container>
    );
}

export default Movement;