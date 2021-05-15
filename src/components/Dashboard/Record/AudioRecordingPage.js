import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faUpload, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import AudioRecordingModal from './RecordingModal.js';
import UploadExistingFileModal from './UploadExistingFileModal.js';
import DropDown from '../../shared_components/DropDown.js';
import { API_URL } from '../../../constants.js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../shared_components/Modal.js';
import { Button } from '../../shared_components/Button.js';
import Cookie from 'js-cookie';
import { CircleSpinner } from '../../shared_components/Spinner.js';
import ReactTooltip from "react-tooltip";
import { useToasts } from 'react-toast-notifications';
import { useLocation } from 'react-router-dom';

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
`;

const RecordNewAudioContainer = styled.div`
  position: relative;
  top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .dropdown-row {
    // to position New Topic icon
    position: relative;
    display: flex;
    align-items: center;
  }
`;

const CreateNewPitchTopicIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-left: 5px;
`;

const RecordIconContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const RecordIcon = styled(FontAwesomeIcon)`
  color: ${({disable}) => disable ? '#696969' : '#F50057'};       
  cursor: pointer;
  pointer-events: ${({disable}) => disable ? 'none' : 'auto'};
  
  &:hover {
      color: ${({disable}) => {if(!disable) return '#8B0000'}};       
  }
`;

const NewPitchTopicNameInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #dddddd;
  margin-bottom: 15px;
  box-sizing: border-box;
`;

const AlreadyHaveAudioContainer = styled.div`
  padding: 64px 32px;
  background-color: #FFFFFFF;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  width: 50%;
  
  h2 {
    text-align: center;
  }

  p {
    font-size: 20px;
    text-align: center;
  }
`;

const UploadIconContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const UploadIcon = styled(FontAwesomeIcon)`
  cursor: pointer;

  &:hover {
    color: #7C7877;
  }
`;


const AudioRecording = (props) => {
   
    // pitches array that will be used in the drop down
    const [pitches, setPitches] = useState([]);
    const [newPitchTopicName, setNewPitchTopicName] = useState('');
    // whenever we save a new pitch topic, we want to rerender so that we fill the Dropdown with the new pitch topic
    const [newPitchTopicResponse, setNewPitchTopicResponse] = useState('');
    const [currentDropDownValue, setCurrentDropDownValue] = useState('');
    const [showRecordingModal, setShowRecordingModal] = useState(false);
    const [showNewPitchTopicModal, setShowNewPitchTopicModal] = useState(false);
    const [showUploadExistingFileModal, setShowUploadExistingFileModal] = useState(false)
    const [showSavingAudioSpinner,setShowSavingAudioSpinner] = useState(false);
    // when spinner appears
    const [showGrayOutViewPort, setShowGrayOutViewPort] = useState(false);

    const { addToast } = useToasts();

    const location = useLocation();

    // if nothing is typed in input and no pitch topic selection, don't allow to record
    let disableRecordIcon;

    if (currentDropDownValue)
      disableRecordIcon = false;
    else
      disableRecordIcon = true;
    
    // So we can set the state variable from the child
    // this allows us to set the parent's state from the child. This way, we know the drop down's value in the parent, although it is set in the child
    const setDropDownValue = (value) => {
        setCurrentDropDownValue(value);
    }

    let openRecordingModal = () => setShowRecordingModal(true);
    let closeRecordingModal = () => setShowRecordingModal(false);

    function showSpinnerOnAudioRecordingPage(showSpinner) {
      if (showSpinner === true) {
        setShowSavingAudioSpinner(true);
        setShowGrayOutViewPort(true);
      } else {
        setShowSavingAudioSpinner(false);
        setShowGrayOutViewPort(false);
      }
      
    }

    // get all pitch topics associated with user (useEffect, create new endpoint)
    useEffect(() => {
      fetch(API_URL + "api/pitchtopics", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookie.get('csrftoken')
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(parsedResponse => {
            // need to change to work with Dropdown
            let array = parsedResponse.map(function(pitch) {
              if(pitch.name === newPitchTopicName) {
                setDropDownValue({id: pitch.id, title: pitch.name, selected: true })
                return { id: pitch.id, title: pitch.name, selected: true }
              } else if(props.location != null && props.location.state != null && pitch.name === props.location.state.pitch_from_pitch_topic_page.name) {
                setDropDownValue({id: props.location.state.pitch_from_pitch_topic_page.id, title: props.location.state.pitch_from_pitch_topic_page.name, selected: true })
                return { id: props.location.state.pitch_from_pitch_topic_page.id, title: props.location.state.pitch_from_pitch_topic_page.name, selected: true }
              } else {
                return { id: pitch.id, title: pitch.name, selected: false }
              }
            });
            setPitches(array);
        });
    }, [newPitchTopicResponse]) // render when new pitches are created

    function saveNewPitchTopic(e) {

      fetch(API_URL + "api/pitchtopics", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookie.get('csrftoken')
        },
        body: JSON.stringify({ pitch_topic: newPitchTopicName }),
        credentials: 'include' // take away this and token is not rquired
      })
        .then(response => {
          if(response.status === 201) {
            addToast('Pitch Topic created', { appearance: 'success', autoDismiss: true});
            return response.json()
          } else if(response.status === 409) {
            addToast('A pitch topic with that name already exists!', { appearance: 'error', autoDismiss: true});
            return Promise.reject(response.statusText);
          }
        })
        .then(parsedResponse => {
          setNewPitchTopicResponse(parsedResponse);
          setShowNewPitchTopicModal(false);
          setNewPitchTopicName('');
          props.setRefreshFromChild();
        }).catch(error => console.log(error));
    }

    function getTitle() {
      console.log(location)
  
      if(newPitchTopicResponse === '') {
        // we must be coming from the pitch topic page
        if(location.state != null) {
          return location.state.pitch_from_pitch_topic_page.name;
        } else {
          return "Select a pitch topic";
        }
      } else {
        return newPitchTopicResponse.name;
      }
    }

    let savingSpinner;
    if (showSavingAudioSpinner) {
        savingSpinner = <CircleSpinner />
    } else {
        savingSpinner = null;
    }

    return (
      <Container>
        {/* <Banner /> */}
        <GrayOutViewPort visible={showGrayOutViewPort} />

        {savingSpinner}

        <h1>Record a new audio file</h1>

        <RecordNewAudioContainer>
          <div class="dropdown-row">
              <DropDown
                searchable={["Search for a topic", "No Matching topics"]}
                title={getTitle()}
                list={pitches}
                function={setDropDownValue}
              />
              <CreateNewPitchTopicIcon data-tip="Create new topic" onClick={() => setShowNewPitchTopicModal(true)} icon={faPlusCircle} size="2x" />
            </div>
          
            <p>Now that you have choosen the pitch topic, record a file or pick an existing one!</p>

            <RecordIconContainer>
              <RecordIcon disable={disableRecordIcon} onClick={openRecordingModal} icon={faMicrophone} size="5x" />
            </RecordIconContainer>
        </RecordNewAudioContainer>

        <Modal show={showNewPitchTopicModal} closeModalFromChild={() => setShowNewPitchTopicModal(false)}>
          <ModalHeader>Create new pitch topic</ModalHeader>

          <ModalBody>
            <p>Enter name for pitch topic!</p>
            <NewPitchTopicNameInput type="text" name="pitchtopic" placeholder="Pitch Topic name" value={newPitchTopicName} required onChange={(e) => setNewPitchTopicName(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowNewPitchTopicModal(false); setNewPitchTopicName(''); }}>Cancel</Button>
            <Button variant="primary" onClick={saveNewPitchTopic}>Save Changes</Button>
          </ModalFooter>
        </Modal>

        <div class="center-horizontal">
          <AlreadyHaveAudioContainer>
            <h2>Already have an audio file?</h2>
            <p>Click below to upload it!</p>
          
            <UploadIconContainer>
              <UploadIcon onClick={() => setShowUploadExistingFileModal(true)} icon={faUpload} size="5x"></UploadIcon>
            </UploadIconContainer>
          </AlreadyHaveAudioContainer>
        </div>
       
        <AudioRecordingModal showModal={showRecordingModal} pitchTopic={currentDropDownValue} showSpinnerOnAudioRecordingPage={showSpinnerOnAudioRecordingPage} onCloseFunction={closeRecordingModal} />
        <UploadExistingFileModal showModal={showUploadExistingFileModal} pitchTopic={currentDropDownValue} showSpinnerOnAudioRecordingPage={showSpinnerOnAudioRecordingPage} closeModalFromChild={() => setShowUploadExistingFileModal(false)} />
        <ReactTooltip />
      </Container>
    )
}

export default AudioRecording;