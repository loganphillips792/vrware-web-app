import React, { useState } from 'react';
import { API_URL } from '../../../../constants.js';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { ReactMicPlus } from 'react-mic-plus';
import { Button } from '../../../shared_components/Button.js';

const Container = styled.div`
    img {
        width: 100%;
    }
`;

const TwoColumns = styled.div`
    display: flex;
    text-align: center;
    
    div {
        flex: 50%;
    }
`;

export const ImprovementOverview = props => {
    if (props.currentStep !== props.pageNumber) {
        return null;
    }

    function renderMetricsToNotImprove() {
        let elements = [];
        for (const obj of props.improvementData) {
            if(!obj.needsImprovement) {
                elements.push(<div>{obj.nameToDisplay}</div>)
            }
        }
        return elements;
    }
    
    function renderMetricsToImprove() {
        let elements = [];
        for (const obj of props.improvementData) {
            if(obj.needsImprovement) {
                elements.push(<div>{obj.nameToDisplay}</div>)
            }
        }
        return elements;
    }

    return (
        <Container>
            <TwoColumns>
                <div>
                    <p>What you did well</p>
                    {renderMetricsToNotImprove()}
                </div>

                <div>
                    <p>Needs Improvement</p>
                    {renderMetricsToImprove()}
                </div>
            </TwoColumns>
        </Container>
    );
}

const StyledWhatYouCouldImprove = styled.div`
    font-size: 2vw;
`;

export const WhatYouCouldImprove = props => {
    if (props.currentStep !== props.pageNumber) {
        return null;
    }

    function getNumberOfMetricsThatNeedImprovement() {
        const needsImprovementOnly = props.improvementData.map((el) => el.needsImprovement);
        const count = needsImprovementOnly.filter(Boolean).length;
        return count;
    }

    function getDisplayNameOfMetricsToImprove() {
        const arr = props.improvementData.filter(obj => obj.needsImprovement == true);
        let elements = 
            <div>
                <li>
                    {arr[0].nameToDisplay}
                </li>
                <li>
                    {arr[1].nameToDisplay}
                </li>
            </div>
        return elements;
    }

    return (
        <StyledWhatYouCouldImprove>
            <div>We found {getNumberOfMetricsThatNeedImprovement()} metrics that could use improvement.</div>
            <br />
            <div>
                Let's focus on the following 2:
                {
                    getDisplayNameOfMetricsToImprove()
                }
            </div>
        </StyledWhatYouCouldImprove>
    );
}

const StyledPrepareToImproveMetricOne = styled.div`
    position: relative;
    height: 100%;
`;

const Tips = styled.div`
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    background-color: rgba(104, 225, 253, 29%); // #68E1FD
    width: 158px;
    height: 166px;
    border-radius: 15px;
    text-align: center;
   
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

const GoodSpeechExampleAccordionContainer = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
`;

const GoodSpeechExampleAccordion = styled.div`
    background-color: #C4C4C4;
`;

const AccordionHeader = styled.div`
    padding: 15px;
    cursor: pointer;
`;

const AccordionBody = styled.div`
    background-color: #ECECEC;
    max-height: ${props => props.show ? '300px' : '0px'};
    transition: max-height 0.35s ease;
    overflow-y: auto;
`;

export const PrepareToImproveMetric = props => {
    const [expandAccordion, setExpandAccordion] = useState(false);

    if (props.currentStep !== props.pageNumber) {
        return null;
    }

    return (
        <StyledPrepareToImproveMetricOne>
            <span class="improvement-text">{props.improvementData.promptForPrepareToImprove}</span>

            <Tips>
                <p>Tips!</p>
                <div>
                    {props.improvementData.tips.map(e => <div>-{e}</div>)}
                </div>
            </Tips>
           
            {Object.keys(props.improvementData.goodExampleOne).length === 0 && props.improvementData.goodExampleOne.constructor === Object && <audio controls src={props.improvementData.goodExampleOne.url} />}

            <GoodSpeechExampleAccordionContainer>
                {Object.keys(props.improvementData.goodExampleOne).length !== 0 && props.improvementData.goodExampleOne.constructor === Object &&
                    <GoodSpeechExampleAccordion>
                        <AccordionHeader onClick={() => setExpandAccordion(!expandAccordion)}>
                            {props.improvementData.goodExampleOne.name}
                        </AccordionHeader>

                        <AccordionBody show={expandAccordion}>
                            {props.improvementData.goodExampleOne.content}
                        </AccordionBody>
                    </GoodSpeechExampleAccordion>
                }

                {Object.keys(props.improvementData.goodExampleTwo).length !== 0 && props.improvementData.goodExampleTwo.constructor === Object &&
                    <GoodSpeechExampleAccordion>
                        <AccordionHeader onClick={() => setExpandAccordion(!expandAccordion)}>
                            {props.improvementData.goodExampleTwo.name}
                        </AccordionHeader>

                        <AccordionBody show={expandAccordion}>
                            {props.improvementData.goodExampleTwo.content}
                        </AccordionBody>
                    </GoodSpeechExampleAccordion>
                }
            </GoodSpeechExampleAccordionContainer>

        </StyledPrepareToImproveMetricOne>
    );
}

const StyledImproveMetric = styled.div`
    // position <ButtonsRow /> relative to this
    position: relative;
    height: 100%;
    font-size: 100%;
`;

const ReactMicContainer = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .goal-actual-row {
        display: flex;
        justify-content: space-evenly;
    }
`;

const ButtonsRow = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 25px;
    position: absolute;
    bottom: 0;
    width: 100%;
 
    div {
        margin: 0 5px;
    }
`;


const TrashIcon = styled(FontAwesomeIcon)``;
const RecordIcon = styled(FontAwesomeIcon)``;
const SaveIcon = styled(FontAwesomeIcon)``;

export const ImproveMetric = props => {
    const [record, setRecord] = useState(false); // start recording
    const [blob, setBlob] = useState(''); // save the blob
    const [blobURL, setBlobURL] = useState(''); // save blob API_URL

    const [mostRecentResult, setMostRecentResult] = useState('-');

    const [showStartButton, setShowStartButton] = useState(true);
    const [disableStopRecordingButton, setDisableStopRecordingButton] = useState(false);
    const [disableDeletePitchButton, setDisableDeletePitchButton] = useState(true);
    const [disableSavePitchButton, setDisableSavePitchButton] = useState(true);

    const [isUploading, setIsUploading] = useState(false);

    if (props.currentStep !== props.pageNumber) {
        return null;
    }

    function onData(recordedBlob) {
        //console.log('Chunk of real-time data is: ', recordedBlob);
    }

    // When react-mic stops recording
    function onStop(recordedBlob) {
        setBlob(recordedBlob.blob);
        setBlobURL(recordedBlob.blobURL);
    }

    function onSave() {
        setIsUploading(true);

        let file = new File([blob], "");

        let headers = new Headers();
        headers.append('X-CSRFToken', Cookie.get('csrftoken'));
        headers.append('Accept', 'application/json');
       
        let formData = new FormData();

        formData.append("audio_file", file, "uploaded_audio");
        formData.append("metric_to_analyze", props.improvementData.metric)
        
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData, 
            credentials: 'include'
        }

        fetch(API_URL+"api/analyze_single_metric", requestOptions)
            .then(response => {
                response.json().then(jsonResponse => {
                    setIsUploading(false);
                    if (response.status === 202) {
                        setMostRecentResult(jsonResponse.metric_to_analyze);
                        props.addResultsToObjectInPriorityList(jsonResponse.metric_to_analyze, jsonResponse.value);
                    } else if(response.status === 400) {
                        console.log(jsonResponse.msg);
                    }
                })
            })
    }

    let startRecording = () => {
        setRecord(true);
        setShowStartButton(false);
        // don't start the timer until permissions dialog is gone
        navigator.permissions.query(
            { name: 'microphone'}
        ).then(function(permissionStatus) {
            // if permissions are already granted
            if(permissionStatus.state === 'granted') {}

            permissionStatus.onchange = function() {
                // if they choose allow
                if(this.state === 'granted') {}
            }
        })
    }

    function stopRecording() {
        // Make react mic stop recording
        setRecord(false);
        setDisableStopRecordingButton(true);
        setDisableDeletePitchButton(false);
        setDisableSavePitchButton(false);
    }

    function handleDeleteRecording() {
        setShowStartButton(true);
        setDisableStopRecordingButton(false);
        setDisableDeletePitchButton(true);
        setDisableSavePitchButton(true);
        setBlob('');
        setBlobURL('');
    }

    const getRandomPrompt = () => {
        return props.improvementData.promptsForPracticePassage[Math.floor(Math.random() * props.improvementData.promptsForPracticePassage.length)];
    }

    // TODO: MyPitchItem.js has a metricNeedsToBeImproved function. Move to a file. Then, call that function here when new recording takes place. 
    // In the results div, color the result as either green or red.

    return (
        <StyledImproveMetric>
            <p>{getRandomPrompt()}</p>

            {props.improvementData.practicePassage &&
                <div>{props.improvementData.practicePassage}</div>
            }

        

            
            <ReactMicContainer>
                <div class="goal-actual-row">
                    <div>Goal: {props.improvementData.goalValue} </div>
                    <div>Actual: {mostRecentResult}</div>
                </div>
                <ReactMicPlus
                    record={record}
                    onStop={onStop}
                    onData={onData}
                    strokeColor='#009DFF'
                    backgroundColor='#212121'
                    visualSetting="sinewave"
                    //mimeType={'audio/wav'}
                    bufferSize={'2048'}
                    sampleRate={'44100'}
                    audioBitsPerSecond
                />
            </ReactMicContainer>
            <ButtonsRow>
                {showStartButton
                    ?
                    <Button variant="primary" onClick={startRecording}>
                        <RecordIcon icon={faMicrophone} size="1x" />
                    </Button>
                    :
                    <Button variant="danger" onClick={stopRecording} disable={disableStopRecordingButton}>
                        <TrashIcon icon={faTrash} size="1x" />
                        Stop Recording
                    </Button>
                }
                <Button variant="danger" onClick={handleDeleteRecording} disable={disableDeletePitchButton}>
                    <TrashIcon icon={faTrash} size="1x" />
                </Button>
                <Button variant="primary" disable={disableSavePitchButton} onClick={onSave}>
                    {isUploading ?
                        <div>Uploading...</div>
                        :
                        <SaveIcon icon={faSave} size="1x" />
                    }
                </Button>
            </ButtonsRow>
        </StyledImproveMetric>
    );

}

const StyledResultsOfMetric = styled.div`

`;

export const ResultsOfMetric = (props) => {
    if (props.currentStep !== props.pageNumber) {
        return null;
    }

    function renderResults() {
        return props.improvementData.results.results.map((result, index) => {
            return <div key={index}>{result}</div>;
        });
    }

    return (
        <StyledResultsOfMetric>
            <p>RESULTS</p>
            {renderResults()}
        </StyledResultsOfMetric>
    );
}