import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactMicPlus } from 'react-mic-plus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../../constants.js';
import Cookie from 'js-cookie';
import { Redirect } from 'react-router-dom';
import useStopWatch from '../../shared_components/hooks/useStopWatch.js';
import { useToasts } from 'react-toast-notifications';
import { Button } from '../../shared_components/Button.js';

const StyledRecordingModal = styled.div`
    background-color: #212121;
    display: ${props => {
        if (props.showModal === true) {
            return 'block';
        }
        else {
            return 'none';
        }
    }}
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    #date {
        display: inline-block;
        width: 100%;
        text-align: center;
        color: #FFFFFF;
    }
`;

const PlayCircle = styled(FontAwesomeIcon)`
`;

/* BUTTONS ROW*/
const StartRecordingButtonRow = styled.div`
    display: flex;
    justify-content: center;
`;

const DeleteSaveButtonsRow = styled.div`
    display: ${props => props.showButtonsRow ? 'flex' : 'none'};
    justify-content: space-evenly;
    margin-top: 25px;
    margin-bottom: 25px;
`;

const TrashIcon = styled(FontAwesomeIcon)``;

const SaveIcon = styled(FontAwesomeIcon)``;

const AudioPlayerContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const AudioPlayer = styled.audio``;

const RecordingHeader = styled.div`
    position: relative;

    h1, h2 {
        color: #FFFFFF;
        text-align: center;
    } 

    span {
        color: #FFFFFF;
        cursor: pointer;
        position: absolute;
        top: 2px;
        right: 2px;

        &:hover {
        }

    }
`;

const Timer = styled.p`
    text-align: center;
    color: #FFFFFF;
    font-size: 150%;
`;


const AudioRecordingModal = (props) => {
    const [record, setRecord] = useState(false); // start recording
    const [blob, setBlob] = useState(''); // save the blob
    const [blobURL, setBlobURL] = useState(''); // save blob url
    const [showRecordIcon, setShowRecordIcon] = useState(true);
    const [showAudioPlayer, setShowAudioPlayer] = useState(false); // show the media player to listen to recorded audio 
    const [showButtonsRow, setShowButtonsRow] = useState(true); // show delete, stop and save buttons
    const [showTimer, setShowTimer] = useState(false);
    const [showStartButton, setShowStartButton] = useState(true);
    const [disableStopRecordingButton, setDisableStopRecordingButton] = useState(false);
    const [disableDeletePitchButton, setDisableDeletePitchButton] = useState(true);
    const [disableSavePitchButton, setDisableSavePitchButton] = useState(true);
    // if audio upload is successful, take back to profile
    const [redirect, setRedirect] = useState(false);

    const { pitchTopic } = props;

    const {
        isRunning, 
        elapsedTime, 
        startTimer, 
        stopTimer, 
        resetTimer
    } = useStopWatch();

    const { addToast } = useToasts();

    useEffect(() => {
        setShowRecordIcon(false);
    }, []);

    let startRecording = () => {
        setRecord(true);
        setShowStartButton(false);
        setShowTimer(true);
        // don't start the timer until permissions dialog is gone
        navigator.permissions.query(
            { name: 'microphone'}
        ).then(function(permissionStatus) {
            // if permissions are already granted
            if(permissionStatus.state === 'granted') {
                startTimer();
            }

            permissionStatus.onchange = function() {
                // if they choose allow
                if(this.state === 'granted') {
                    startTimer();
                }
            }
        })
    }

    function stopRecording() {
        // Make react mic stop recording
        setRecord(false);
        stopTimer();
        setDisableStopRecordingButton(true);
        setDisableDeletePitchButton(false);
        setDisableSavePitchButton(false);
    }

    function onData(recordedBlob) {
        //console.log('Chunk of real-time data is: ', recordedBlob);
    }

    // When react-mic stops recording
    function onStop(recordedBlob) {
        console.log('recordedBlob is: ', recordedBlob);
        setBlob(recordedBlob.blob);
        setBlobURL(recordedBlob.blobURL);
        setShowAudioPlayer(true);
    }

    function onSave() {

        props.onCloseFunction();
        props.showSpinnerOnAudioRecordingPage(true);
        
        let file = new File([blob], "");

        let headers = new Headers();
        headers.append('X-CSRFToken', Cookie.get('csrftoken'));
        headers.append('Accept', 'application/json');
       
        let formData = new FormData();

        formData.append("audio_file", file, "uploaded_audio");
        formData.append("pitch_topic", pitchTopic.id);

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData, 
            credentials: 'include'
        }

        fetch(API_URL+"api/upload_audio", requestOptions)
            .then(response => {
                response.json().then(jsonResponse => {
                    if (response.status === 202) {
                        addToast('1 file successfully uploaded', { appearance: 'success', autoDismiss: true});
                        setRedirect(true);
                    } else if(response.status === 409) {
                        props.showSpinnerOnAudioRecordingPage(false);
                        addToast(jsonResponse['msg'], { appearance: 'error', autoDismiss: true});
                    }
                })
            })
    }

    // allow user to record new pitch
    function handleDeleteRecording() {
        setShowStartButton(true);
        setDisableStopRecordingButton(false);
        setDisableDeletePitchButton(true);
        setDisableSavePitchButton(true);
        resetTimer();
        setBlob('');
        setBlobURL('');
        setShowAudioPlayer(false);
        props.onCloseFunction();
    }

    let audioPlayer;

    if (showAudioPlayer === true) {
        audioPlayer = <AudioPlayer controls="controls" src={blobURL} type="audio/wav" />
    } else {
        audioPlayer = null;
    }

    let timer;
    let date;

    if (showTimer === true) {
        let centiseconds = ("0" + (Math.floor(elapsedTime / 10) % 100)).slice(-2);
        let seconds = ("0" + (Math.floor(elapsedTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(elapsedTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(elapsedTime / 3600000)).slice(-2);
        timer = <Timer>{hours} : {minutes} : {seconds} : {centiseconds}</Timer>
        date = <span id="date">{ new Date().toDateString() }</span>
    } else {
        timer = null;
        date = null;
    }

    return (
        <StyledRecordingModal showModal={props.showModal}>
             { redirect && <Redirect to={{ pathname: "/dashboard/overview" }} /> }

            <RecordingHeader>
                <h2>{pitchTopic.title}</h2>
                <span onClick={props.onCloseFunction}>X</span>
            </RecordingHeader>

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
            
            <AudioPlayerContainer>
                { audioPlayer }
            </AudioPlayerContainer>
            
            { timer }
            { date }

            <StartRecordingButtonRow>
                {showStartButton 
                    ? 
                    <Button variant="primary" onClick={startRecording}>
                        <SaveIcon icon={faSave} size="1x" />
                        Start Recording
                    </Button>   
                    : 
                    <Button variant="danger" onClick={stopRecording} disable={disableStopRecordingButton}>
                        <TrashIcon icon={faTrash} size="1x" />
                        Stop Recording
                    </Button>
                }
            </StartRecordingButtonRow>
            
            <DeleteSaveButtonsRow showButtonsRow={showButtonsRow}>
                <Button variant="danger" onClick={handleDeleteRecording} disable={disableDeletePitchButton}>
                    <TrashIcon icon={faTrash} size="1x" />
                    Delete
                </Button>
                <Button variant="primary" disable={disableSavePitchButton} onClick={onSave}>
                    <SaveIcon icon={faSave} size="1x" />
                    Save Pitch
                </Button>               
            </DeleteSaveButtonsRow>
        </StyledRecordingModal>
    )
}

export default AudioRecordingModal;