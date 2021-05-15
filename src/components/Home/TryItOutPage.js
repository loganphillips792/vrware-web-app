import React, { useState, useEffect, useCallback, useContext } from "react";
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../constants.js';
import Cookie from 'js-cookie';
import { CircleSpinner } from '../shared_components/Spinner.js';
import ReactTooltip from "react-tooltip";
import 'antd/dist/antd.css';
import { Radio } from 'antd';
import { ReactMicPlus } from 'react-mic-plus';
import useStopWatch from '../shared_components/hooks/useStopWatch.js';
import {useDropzone} from 'react-dropzone';
import { useToasts } from 'react-toast-notifications';
import { Redirect } from 'react-router-dom';
import Preloader from "./preloader";
import Navbar from "./navbar";
import Particles from "react-particles-js";
import particleConfig from "./particleConfig";

const GrayOutViewPort = styled.div`
  display: ${({ visible }) => visible ? 'block' : 'none'};
  opacity: 0.5;
  background: #000;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 2;
`;

const Container = styled.div`
  height: 100vh;
  // position AlreadyHaveAudioContainer
  position: relative;

  h1 {
    text-align: center;
    margin-top: 20px;
  }
  
  .center-horizontal {
    display: flex;
    justify-content: center;
    // move AlreadyHaveUploadContainer
    position: relative;
    top: 20%;
  }

  .form-container {
      margin-top: 30px;
  }
`;

const LoginTextContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const LoginText = styled.div`
  margin-right: 5px;

  .sign-in-text {
      cursor: pointer;
  }
`;

const RadioButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const ClearTableButton = styled.button`
	border: 1px solid #ff9922;
	background: -webkit-linear-gradient(
	  to right,
	  #7db0db,
	  #ff9922
	); /* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(
	  to right,
	  #7db0db,
	  #ff9922
	); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.19);
	color: #ffff;
	padding: 13px 32px;
	border-radius: 30px;
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
	transition: 0.3s;
	display: inline-block;
	&:hover, &:focus {
		border-color: #ff9922;
	    background: #fff;
	    color: #ff9922;
	    text-decoration: none;
	}
    /*
    display: inline-block;
    padding:0.3em 1.2em;
    margin:0 0.3em 0.3em 0;
    border-radius:2em;
    box-sizing: border-box;
    text-decoration:none;
    font-family:'Roboto',sans-serif;
    font-weight:300;
    color:#FFFFFF;
    background-color:#4eb5f1;
    text-align:center;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
        background-color:#4095c6;
    }
    */
`;

const GlobalStyle = createGlobalStyle`
body {
  color: ${props => (props.whiteColor ? 'white' : 'black')};
}
`
const TryItOutPage = (props) => {
    document.body.style.background = '#eee';
   
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [radioButtonValue, setRadioButtonValue] = useState('record');
    const [showSavingAudioSpinner,setShowSavingAudioSpinner] = useState(false);
    const [refresh, setRefresh] = useState(false);
    // when spinner appears
    const [showGrayOutViewPort, setShowGrayOutViewPort] = useState(false);

    const { addToast } = useToasts();

    useEffect(() => {
    
        // token is only ever set when user successfully logins in
        let token = Cookie.get('csrftoken');
    
        if (token) {
        
            fetch(API_URL + 'verifysession/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookie.get('csrftoken')
                },
                'credentials': 'include'
            })
                .then(response => {
                    if (response.status === 401) {
                        setIsAuthenticated(false);
                    } else if (response.status === 200) {
                        addToast('You are already logged in! Taking you to your profile page', { appearance: 'info', autoDismiss: true});
                        setTimeout(function(){setIsAuthenticated(true);}, 2000);
                    } else {
                        setIsAuthenticated(false);
                    }
                    return response.json();
                })
                .then(response => {
                    
                }).catch(error => console.log("ERROR", error));

        } else {
            setIsAuthenticated(false);
        }

    }, [isAuthenticated]);

    function handleClearTableButtonClick() {
        if(localStorage.getItem('pitchesArray') === null) {
            addToast('No pitches to delete!', { appearance: 'error', autoDismiss: true});
        } else {
            if(localStorage.getItem('pitchesArray').length === 0) {
                addToast('No pitches to delete!', { appearance: 'error', autoDismiss: true});
            } else {
                localStorage.clear();
                setRefresh(!refresh);
                addToast('Table cleared', { appearance: 'success', autoDismiss: true});
            }
        }
    }

    let savingSpinner;
    if (showSavingAudioSpinner) {
        savingSpinner = <CircleSpinner />
    } else {
        savingSpinner = null;
    }

    let recordingFormToShow;

    if(radioButtonValue === 'record') {
        recordingFormToShow = <Recording triggerRefreshFromChild={() => setRefresh(!refresh) } showSpinnerOnAudioRecordingPage={(val) => { setShowSavingAudioSpinner(val); setShowGrayOutViewPort(val); } } />;
    } else {
        recordingFormToShow = <UploadExistingFile triggerRefreshFromChild={() => setRefresh(!refresh) } showSpinnerOnAudioRecordingPage={(val) => { setShowSavingAudioSpinner(val); setShowGrayOutViewPort(val); } } />
    }

    return (
        <Container>
            <Preloader />
            <Navbar />
            <section id="slider_area" class="welcome-area" style={{ height: "100%" }}>

                { isAuthenticated && <Redirect to={{ pathname: "/dashboard/overview" }} /> }

                <GlobalStyle />
                {/* <Banner /> */}
                <GrayOutViewPort visible={showGrayOutViewPort} />

                {savingSpinner}

                <LoginTextContainer>
                    <LoginText><span class="small-text">Already have an account? </span><a href="/login">Sign in!</a></LoginText>
                </LoginTextContainer>

                <div class="single-slide-item-table">
                    <div class="single-slide-item-block">
                        {radioButtonValue === 'record' ? <h1 class="main-h1">Record a new audio file</h1> : <h1 class="main-h1">Upload an existing audio file</h1>}

                        <RadioButtonsContainer>
                            <Radio.Group value={radioButtonValue} onChange={(e) => setRadioButtonValue(e.target.value)}>
                                <Radio value={'record'}><span class="menu-item-text">Record new</span></Radio>
                                <Radio value={'upload'}><span class="menu-item-text">Upload existing</span></Radio>
                            </Radio.Group>
                        </RadioButtonsContainer>
                        <div class="form-container">
                            {recordingFormToShow}
                        </div>

                        <MetricsTable list={localStorage.getItem('pitchesArray') != null ? JSON.parse(localStorage.getItem('pitchesArray')) : []} />
                        <ClearTableButton onClick={handleClearTableButtonClick}>Clear Table</ClearTableButton>
                    </div>
                </div>

                <Particles
                    params={{ particles: particleConfig.particles }}
                    style={{
                        width: "100%",
                        position: "absolute",
                        top: 0
                    }}
                />
            </section>

        </Container>
    )
}

export default TryItOutPage;

const RecordingContainer = styled.div`
`;

const MicContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const AudioPlayerContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const ButtonsRow = styled.div`
    display: ${props => props.showButtonsRow ? 'flex' : 'none'};
    justify-content: center;
    margin: 0 -5px;
    margin-top: 25px;
    margin-bottom: 25px;
`;

const StyledButton = styled.button`
	border: 1px solid #ff9922;
	background: -webkit-linear-gradient(
	  to right,
	  #7db0db,
	  #ff9922
	); /* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(
	  to right,
	  #7db0db,
	  #ff9922
	); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.19);
	color: #ffff;
	padding: 13px 32px;
	border-radius: 30px;
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
	transition: 0.3s;
	display: inline-block;
	&:hover, &:focus {
		border-color: #ff9922;
	    background: #fff;
	    color: #ff9922;
	    text-decoration: none;
    }
    
/*
    color: #FFFFFF
    border: 2px solid black;
    margin: 0 5px;
    border-radius: 5px;
    padding: 7px;
    transition: 0.3s;
*/
`;

const StartButton = styled(StyledButton)`
    //background-color: #007BFF;
    cursor: pointer;
`;

const StopButton = styled(StyledButton)`
    //background-color: #DC3545;
    cursor: pointer;
`;

const SaveButton = styled(StyledButton)`
    //background-color: #007BFF;
    cursor: pointer; 
`;

const SaveIcon = styled(FontAwesomeIcon)``;

const AudioPlayer = styled.audio``;

const Timer = styled.p`
    text-align: center;
    color: #FFFFFF;
    font-size: 150%;
`;


const Recording = (props) => {
    const [record, setRecord] = useState(false); // start recording
    const [blob, setBlob] = useState(''); // save the blob
    const [blobURL, setBlobURL] = useState(''); // save blob url WE
    const [showAudioPlayer, setShowAudioPlayer] = useState(false); // show the media player to listen to recorded audio
    const [showButtonsRow, setShowButtonsRow] = useState(true); // show delete, stop and save buttons
    const [showTimer, setShowTimer] = useState(false);
    const [showStartButton, setShowStartButton] = useState(true);

    const {
        isRunning,
        elapsedTime,
        startTimer,
        stopTimer,
        resetTimer
    } = useStopWatch();

    useEffect(() => {
        
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
    }

    function onData(recordedBlob) {}

    // When react-mic stops recording
    function onStop(recordedBlob) {
        // console.log('recordedBlob is: ', recordedBlob);
        setBlob(recordedBlob.blob);
        setBlobURL(recordedBlob.blobURL);
        setShowAudioPlayer(true);
    }

    function onSave() {

        props.showSpinnerOnAudioRecordingPage(true);
        
        let file = new File([blob], "");

        let headers = new Headers();
      
        headers.append('Accept', 'application/json');
       
        let formData = new FormData();

        formData.append("audio_file", file, "uploaded_audio");

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData,
        }

        fetch(API_URL+"api/upload_audio", requestOptions)
            .then(response => {
                if (response.status === 202) {
                    return response.json();
                  } else if (response.status === 409) {
                      alert(response.text());
                      // TODO: Reset so they can record again
                  }
                  return response.text()
            })
            .then(result => { 
                let oldPitches = JSON.parse(localStorage.getItem('pitchesArray')) || [];
                oldPitches.push(result['uploaded_audio']);
                localStorage.setItem('pitchesArray', JSON.stringify(oldPitches));
                props.triggerRefreshFromChild();
                props.showSpinnerOnAudioRecordingPage(false);
                setShowAudioPlayer(false);
                resetTimer();
             })
            .catch(error => console.log('error', error));
    }

    let audioPlayer;

    if (showAudioPlayer === true) {
        audioPlayer = <AudioPlayer controls="controls" src={blobURL} type="audio/wav" />
    } else {
        audioPlayer = null;
    }

    let timer;

    if (showTimer === true) {
        let centiseconds = ("0" + (Math.floor(elapsedTime / 10) % 100)).slice(-2);
        let seconds = ("0" + (Math.floor(elapsedTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(elapsedTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(elapsedTime / 3600000)).slice(-2);
        timer = <Timer>{hours} : {minutes} : {seconds} : {centiseconds}</Timer>
    } else {
        timer = null;
    }

    return (
        <RecordingContainer>

            <MicContainer>
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
            </MicContainer>
            
            <AudioPlayerContainer>
                { audioPlayer }
            </AudioPlayerContainer>
            
            { timer }
          
            <ButtonsRow showButtonsRow={showButtonsRow}>
                { showStartButton ? <StartButton onClick={startRecording}>Start</StartButton> : <StopButton onClick={stopRecording}>Stop</StopButton> }
                <SaveButton onClick={onSave}>
                    <SaveIcon icon={faSave} size="1x" /><span> </span>
                    Save
                </SaveButton>
            </ButtonsRow>
        </RecordingContainer>
    )
}

const UploadContainer = styled.div`
    display: flex;
    justify-content: center;
    
    & > * {
        width: 50%;
    }
`;

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
  }

 const DropZoneContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${props => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
 `;

 const ButtonsContainer = styled.div`
    display: flex;
 `;

const UploadExistingFile = (props) => {
    
    const [files, setFiles] = useState(null);
    
    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles);
    }, []);

    function onSave() {
        if (acceptedFiles.length === 1) {
           uploadSingleFile()
        } else if (files.length > 1) {
            //uploadMultipleFiles()
        } else {
            alert("No files selected")
        }
    }
    
    function uploadSingleFile() {
        props.showSpinnerOnAudioRecordingPage(true);
        
        let headers = new Headers();
        headers.append('X-CSRFToken', Cookie.get('csrftoken'));
        headers.append('Accept', 'application/json')
        let formData = new FormData();

        formData.append("audio_file", files[0], "uploaded_audio");

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData,
        }

        fetch(API_URL+"api/upload_audio", requestOptions)
            .then(response => {
                if (response.status === 202) {
                    return response.json();
                } else if (response.status === 409) {
                    // showSpinnerOnAudioRecordingPage(false);
                    // TODO: Reset so they can record again
                }
                return response.text()
            })
            .then(result => {
                let oldPitches = JSON.parse(localStorage.getItem('pitchesArray')) || [];
                oldPitches.push(result['uploaded_audio']);
                localStorage.setItem('pitchesArray', JSON.stringify(oldPitches));
                console.log(result);
                props.triggerRefreshFromChild();
                props.showSpinnerOnAudioRecordingPage(false);
            })
            .catch(error => console.log('error', error));
    }

    const {acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({onDrop, accept: 'audio/wav', multiple: false});

    const filesList = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));


    let disableSaveButton;
    if (acceptedFiles.length > 0)
        disableSaveButton = false;
    else
        disableSaveButton = true;

    return (
        <div>
            <UploadContainer>
                <div>
                    <DropZoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </DropZoneContainer>

                    <div>
                        <h4>Files</h4>
                        <ul>{filesList}</ul>
                    </div>

                    <ButtonsContainer>
                        <SaveButton disable={disableSaveButton} onClick={onSave}>Save</SaveButton>
                    </ButtonsContainer>
                </div>
                
            </UploadContainer>
        </div>
    );
}

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
        padding: 8px;

        .outside-of-range {
            color: #FF0000;
        }
    }

    td {
		border: 1px solid #ddd;
	}

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #ddd;
    }

    th {
        font-size: 15px;
		font-weight: bold;
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.19);
		border-radius: 10px;
		text-shadow: 1px 1px black;
		background: linear-gradient(
		    to right,
		 	#81d1ee,
		    #7db7db
		);
        color: white;
    }
`;

const MetricsTable = (props) => {

    const { list } = props;

    function renderTableHeader() {
        let header = ['Audio name', 'Date', 'Words/Minute', 'Pronunciation Score', 'Pauses Count', 'Articulation Rate', 'Original Duration (mm:ss)'];
        return header.map((key, index) => {
            return <th class="main-p" key={index}>{key.toUpperCase()}</th>
        });
    }

    function renderTableData() {
        return list.map((audio, index) => {
            const { pronunciation_posteriori_probability_score_percentage, date_recorded, pauses_count, rate_of_speech, articulation_rate, original_duration } = audio;
            
            return (
                <tr key={index}>
                    <td>Pitch {index+1}</td>
                    <td>{date_recorded}</td>
                    <td>{parseFloat(rate_of_speech) > 110.00 && parseFloat(rate_of_speech) < 140.00 ? <span>{rate_of_speech}</span> : <span class="outside-of-range">{rate_of_speech}</span> }</td>
                    <td>{pronunciation_posteriori_probability_score_percentage}</td>
                    <td>{pauses_count}</td>
                    <td>{articulation_rate}</td>
                    <td>{new Date(original_duration * 1000).toISOString().substr(11, 8).substr(3)}</td>
                </tr>
            )
        });
    }

    return (
        <PitchMetricsContainer>
            <h3>Metrics</h3>
            <StyledTable>
                <tbody>
                    <tr>{renderTableHeader()}</tr>
                    {renderTableData()}
                </tbody>
            </StyledTable>
            { list.length === 0 && <p class="menu-item-text">Record an audio file to see some metrics!</p>}
        </PitchMetricsContainer>
    );
}