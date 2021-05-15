import React, { useState } from 'react';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
import PitchNotes from './PitchNotes.js';
import Pagination from '../../shared_components/Pagination.js';
import SelectPitchTopic from '../../shared_components/SelectPitchTopic.js';
import EditPitchTopicRow from './EditPitchTopicRow.js';
import MyPitches from './MyPitches.js';

const Container = styled.div`
    padding: 0px 30px 0px 30px;
    
    h1 {
        display: inline;
    }
`;

const MainHeading = styled.h1`
	font-family: "Open Sans", sans-serif;
	line-height: normal;
	color: #fff;
	font-size: 30px;
	margin-top: 20px;
	font-weight: 600;
	letter-spacing: 2px;
	text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.08);
`;

const SubHeading = styled.h2`
	font-family: "Open Sans", sans-serif;
	margin: 0 auto;
	display: table;
	font-size: 25px;
	text-shadow: 1px 1px black;
	color: #00c9fd;
	font-weight: 600;
	line-height: normal;
	color: #fff;
`;

const PitchesAndNotesContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-top: 25px;

    & > div {
        flex-basis: 45%;
    }
`;

const Overview = (props) => {
    const selectedPitchTopic = useStoreState(store => store.selectedPitchTopic);

    // Pagination for pitches
    const [currentPage, setCurrentPage] = useState(1);
    const [audioFilesPerPage, setAudioFilesPerPage] = useState(3);

    // Pagination for notes
    const [currentPageForNotes, setCurrentPageForNotes] = useState(1);
    const [pitchesPerPageForNotes, setPitchesPerPageForNotese] = useState(3);

    if(Object.keys(selectedPitchTopic.pitchTopic).length === 0 && selectedPitchTopic.pitchTopic.constructor === Object) {
        return <SelectPitchTopic />;
    }

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const paginatePitchesForNotes = (pageNumber) => setCurrentPageForNotes(pageNumber);

    // Pagination for pitches
    const indexOfLastAudioFile = currentPage * audioFilesPerPage;
    const indexOfFirstAudioFile = indexOfLastAudioFile - audioFilesPerPage;
    const currentPitches = selectedPitchTopic.pitchTopic.audio_files.slice(indexOfFirstAudioFile, indexOfLastAudioFile);

    // Pagination for notes
    const indexOfLastPitchForNotes = currentPageForNotes * pitchesPerPageForNotes;
    const indexOfFirstPitchForNotes = indexOfLastPitchForNotes - pitchesPerPageForNotes;
    const currentPitchesForNotes = selectedPitchTopic.pitchTopic.audio_files.slice(indexOfFirstPitchForNotes, indexOfLastPitchForNotes);

    return (
        <Container>
            <MainHeading>Overview of {selectedPitchTopic.pitchTopic.name}</MainHeading>

            <EditPitchTopicRow setRefreshFromChild={props.setRefreshFromChild} />
    
            <PitchesAndNotesContainer>
                <div>
                    <SubHeading>My Pitches</SubHeading>
                    <MyPitches audioFiles={currentPitches} setRefreshFromChild={props.setRefreshFromChild} />
                    <Pagination itemsPerPage={audioFilesPerPage} totalItems={selectedPitchTopic.pitchTopic.audio_files.length} currentPage={currentPage} paginate={paginate} />
                </div>

                <div>
                    <SubHeading>My notes</SubHeading>
                    <PitchNotes audioFiles={currentPitchesForNotes} setRefreshFromChild={props.setRefreshFromChild} />
                    <Pagination itemsPerPage={pitchesPerPageForNotes} totalItems={selectedPitchTopic.pitchTopic.audio_files.length} currentPage={currentPageForNotes} paginate={paginatePitchesForNotes} />
                </div>
            </PitchesAndNotesContainer>
        </Container>
    );
}

export default Overview;