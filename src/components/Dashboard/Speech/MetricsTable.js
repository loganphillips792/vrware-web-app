import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../shared_components/Modal.js';

const PitchMetricsContainer = styled.div`
    h3 {
        text-align: center;
    }
`;

const StyledTable = styled.table`
    text-align: center;
    border-collapse: collapse;
    width: 100%;

    td, th {
        // So that we can position the count underneath the score
        position: relative;
        padding: 8px;
        .outside-of-range {
            color: #FF0000;
        }

        .excellent-range {
            color: #32CD32;
        }

        .very-good-range {
            color: #80cd32;
        }

        .good-range {
            color: #73a343;
        }

        .okay-range {
            color: #ede900
        }

        .needs-work-range {
            color: #ed9e00
        }

        .too-slow-or-fast-range {
            color: #FF0000
        }
   }

   td {
        font-family: "Open Sans", sans-serif;
        background-color: rgb(255, 255, 255, 0.6);
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
        border-radius: 3px;
   }

   th {
       // to position <QuestionMark />
        position: relative;
        font-size: 20px;
        font-weight: 600px;
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        box-shadow: 0 0 1px 0.5px rgba(0, 0, 0, 0.5);
        border-radius: 3px;
        border-bottom: 0.5px solid black;
        text-shadow: 1px 1px #000000;
        background-color: rgb(0, 0, 0, 0.09);
        color: #FFFFFF;
   }
`;

const QuestionMark = styled(FontAwesomeIcon)`
   position: absolute;
   top: 0;
   right: 5px;
   display: ${(props) => props.index===props.indexOfQuestionMarkToShow ? 'block' : 'none'};
   cursor: pointer;
`;

const Row = styled.tr`
    border-radius: 5px;
	border: 1px #000000;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.19);
    
    background-color: ${props => {
        if(props.rowID===props.idOfCurrentlySelectedRow) {
            return '#ddd';
        } else {
            return '';
        }
    }}

    &:nth-child(even) {
        background-color: ${props => {
            if(props.rowID===props.idOfCurrentlySelectedRow) {
                return '#ddd';
            } else {
                return '#f2f2f2';
            }
        }}

    }

    &:hover {
        background-color: #ddd;
        cursor: pointer;
    }

    .pauses_count, .words_per_minute, .filler_words {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        font-size: 75%;
    }
`;

const MetricsTable = (props) => {

    const { audioList } = props;

    const [idOfCurrentlySelectedRow, setIDOfCurrentlySelectedRow] = useState(-1);
    const [indexOfQuestionMarkToShow, setIndexOfQuestionMarkToShow] = useState(-1);
    const [showMetricsContextPopup, setShowMetricsContextPopup] = useState(false);
    const [keyOfMetricForPopup, setKeyOfMetricForPopup] = useState('');

    const selectedPitch = useStoreState(store => store.selectedAudio);
    const selectPitch = useStoreActions(actions => actions.selectedAudio.setAudio);

    const showQuestionMark = (metric) => {
        if (metric==='Rate of Speech Score' || metric==="Pronunciation Score" || metric==="Pauses Score" || metric==="Filler Words Score" || metric === "Total Audio Score") {
            return true;
        }
    }

    const getContentForPopup = () => {
        let metricTitle = keyOfMetricForPopup;
        let metricExplanation;

        switch(keyOfMetricForPopup) {
            case 'Rate of Speech Score':
                metricExplanation = " Words per Minute is a critical metric in public speaking.  Speaking too fast means your audience won’t be able \
                to understand you, and speaking too slowly will cause your audience to lose focus.  The optimal speaking rate is between 130 and 135 words per minute;"
                break;
            case 'Pronunciation Score':
                metricExplanation = "Speaking clearly is important so that your audience is able to focus on your message. This score measures how clearly you pronounce your words";
                break;
            case 'Pauses Score':
                metricExplanation = "Frequent and impactful pauses are important for both the speaker and the audience.  Pauses allow the speaker to gather their thoughts and plan their \
                        movement and give the audience a chance to digest the information. This metric measures your effective use of pause while pitching";
                break;
            case 'Filler Words Score':
                metricExplanation = "Using too many filler words in a speech confuses your audience and conveys an uncertainty about your topic. This metric measures what percentage of words are filler words during a speech";
                break;
            case 'Total Audio Score':
                metricExplanation = "This is a combination of the four previous metrics.  This score is meant to show a wholistic score of your pitch and demonstrate your improvement over time";
                break;
        }
        // https://reactjs.org/docs/fragments.html#short-syntax
        return  <>
                    <ModalHeader><div>About <i>{metricTitle}</i></div></ModalHeader>
                    <ModalBody>
                        {metricExplanation}
                    </ModalBody>
                </>
    }

    const getWordsPerMinuteColorCoded = (rateOfSpeech, rateOfSpeechScore) => {
        if(parseFloat(rateOfSpeech) >= 130.00 && parseFloat(rateOfSpeech) <= 135.00) { //Excellent        
            return <span class="excellent-range">{rateOfSpeechScore}</span>;
        } else if(parseFloat(rateOfSpeech) >= 125.00 && parseFloat(rateOfSpeech) <= 140.00) { // Very good
            return <span class="very-good-range">{rateOfSpeechScore}</span>;
        } else if(parseFloat(rateOfSpeech) >= 140.00 && parseFloat(rateOfSpeech) <= 145.00) { // Good
            return <span class="good-range">{rateOfSpeechScore}</span>;
        } else if(parseFloat(rateOfSpeech) >= 120.00 && parseFloat(rateOfSpeech) <= 150.00) { // Okay
            return <span class="okay-range">{rateOfSpeechScore}</span>;
        } else if(parseFloat(rateOfSpeech) >= 140.00 && parseFloat(rateOfSpeech) <= 145.00) { // Needs Work
            return <span class="needs-work-range">{rateOfSpeechScore}</span>;
        } else if(parseFloat(rateOfSpeech) < 115.00) { // Too slow range
            return <span class="too-slow-or-fast-range">{rateOfSpeechScore}</span>;
        } else if(parseFloat(rateOfSpeech) > 160.00) { // Too fast range
            return <span class="too-slow-or-fast-range">{rateOfSpeechScore}</span>;
        }
    }

    function getNumberOfFillerWords(fillerWords) {

        let fillerWordsObject = JSON.parse(fillerWords.replace(/'/g, '"'));

        let count = Object.values(fillerWordsObject).reduce((op, inp) => op + inp, 0);

        return count;
    }

    const handleTableRowClick = (audio, idOfSelectedRow) => {
        // deselect a currently selected row
        if(selectedPitch.audioFile.id === audio.id) {
            selectPitch({})
        } else {
            selectPitch(audio);
        }

        if(idOfSelectedRow===idOfCurrentlySelectedRow) {
            setIDOfCurrentlySelectedRow(-1);
        } else {
            setIDOfCurrentlySelectedRow(idOfSelectedRow);
        }
    }

    function renderTableHeader() {
        let header = ['Audio Name', 'Date Recorded', 'Rate of Speech Score', 'Pronunciation Score', 'Pauses Score', 'Filler Words Score', 'Total Audio Score', 'Original Duration (mm:ss)'];
        return header.map((metric, index) => {
            return <th key={index} onMouseEnter={() => { setIndexOfQuestionMarkToShow(index); } } onMouseLeave={() =>  { setIndexOfQuestionMarkToShow(-1); } }>
                        {metric}
                        {showQuestionMark(metric) &&
                            <QuestionMark icon={faQuestionCircle} index={index} indexOfQuestionMarkToShow={indexOfQuestionMarkToShow} onClick={() => { setShowMetricsContextPopup(!showMetricsContextPopup); setKeyOfMetricForPopup(metric) } } />
                        }
                    </th>
        });
    }
    
    function renderTableData() {
        return audioList.map((audio, index) => {
            const { rate_of_speech_score, rate_of_speech, pronunciation_articulation_score, pause_score, pauses_count, filler_words_score, filler_words, audio_score, original_duration } = audio.metrics;
            
            return (
                <Row key={index} rowID={index} idOfCurrentlySelectedRow={idOfCurrentlySelectedRow} onClick={() => handleTableRowClick(audio, index) } >
                    <td>Pitch {index+1}</td>
                    <td>{audio.date_recorded}</td>
                    <td>
                        {getWordsPerMinuteColorCoded(rate_of_speech, rate_of_speech_score)}
                        <span class="words_per_minute">{`${rate_of_speech} words/minute`}</span>
                    </td>
                    <td>{pronunciation_articulation_score}</td>
                    <td>
                        {pause_score}
                        <span class="pauses_count">{`${pauses_count} pauses`}</span>
                    </td>
                    <td>
                        {filler_words_score}
                        <span class="filler_words">{`${getNumberOfFillerWords(filler_words)} filler words`}</span>
                    </td>
                    <td>{audio_score}</td>
                    <td>{new Date(original_duration * 1000).toISOString().substr(11, 8).substr(3)}</td>
                </Row>
            )
        });
    }

    return (
        <PitchMetricsContainer>
            <StyledTable>
                <tbody>
                    <tr>{renderTableHeader()}</tr>
                    {renderTableData()}
                </tbody>
            </StyledTable>   
            { audioList.length === 0 && <p>Record an audio file to see some metrics!</p>}
            <Modal show={showMetricsContextPopup} closeModalFromChild={() => setShowMetricsContextPopup(false) }>
                { getContentForPopup() }
            </Modal>
        </PitchMetricsContainer>
    );
}

export default MetricsTable;