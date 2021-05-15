import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import { API_URL } from '../../constants.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import Banner from '../shared_components/Banner.js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../shared_components/Modal.js';
import { Button } from '../shared_components/Button.js';
import { Redirect } from 'react-router-dom';
import { Input } from 'antd';
import ReactTooltip from "react-tooltip";
import useOnClickOutside from '../shared_components/hooks/useOnClickOutside.js';
import { Link } from 'react-router-dom';
import PitchNotes from '../PitchTopic/PitchNotes.js';
import { usePopper } from 'react-popper';
import MetricsExplanationModal from '../PitchTopic/MetricsExplanationModal.js';
import MetricsTable from '../PitchTopic/MetricsTable.js';
import ChartsGrid from '../PitchTopic/ChartsGrid.js';
import { useToasts } from 'react-toast-notifications';
import Pagination from '../shared_components/Pagination.js';
import { CircleSpinner } from '../shared_components/Spinner.js';

const Container = styled.div`
    .center-heading {
        text-align: center;
    }
    .pitches-count-label {}
    .popper-container {}
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 -15px;

    & > * {
        margin: 0 15px;
    }

    .icon-container {
        display: flex;
        align-items: center;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #595959;

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }

`;

const AddNewItemToPitchIcon = styled(FontAwesomeIcon)`
    font-size: 35px;

    &:hover {
        cursor: pointer;
    }
`;

const PopoverContainer = styled.div`
    display: ${props => props.visible ? 'block' : 'none'};
    border: 2px solid blue;
    z-index: 2;
    background-color: #fff;
    border-radius: 10px;
    width: 350px;
    border: 1px solid #cccccc;

    .header {
        background-color: #b3b3b3;
        padding: 8px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .body {}
`;

const ChoicesBox = styled.div`
   
    // target last ChoiceItem
    div:last-child {
        border-bottom: none;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`;

const ChoiceItem = styled.div`
    border-bottom: 2px solid #ddd;
    padding: 8px;
    
    &:hover {
        cursor: pointer;
        background-color: #ded9d9;
    }
`;

const EditIcon = styled(FontAwesomeIcon)`
    position: relative;
    top: 15px
    left: 25px;
    margin-bottom: 25px;
    font-size: 35px;

    &:hover {
        cursor: pointer;
    }
`;

const DeleteIcon = styled(FontAwesomeIcon)`
    position: relative;
    top: 15px
    left: 25px;
    margin-bottom: 25px;
    font-size: 35px;

    &:hover {
        color: #dc3545;
        cursor: pointer;
    }
`;

const NotesContainer = styled.div`
    position: relative;
    top: 50px;
`;

const InfoIconContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const InfoIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
`;

const NoPitchesRecordedInfoBoxContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const NoPitchesRecordedInfoBox = styled.div`
    flex-basis: 50%;
    padding:20px;
    margin-top:20px;
    background-color:rgba(255,255,255,0.9);
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    border-radius:3px;
    -webkit-box-shadow: 0px 0px 2px #888888;
    -moz-box-shadow: 0px 0px 2px #888888;
    box-shadow: 0px 0px 2px #888888;

    ul {
        list-style-type: circle;
    }
`;

const NewPitchTopicNameInput = styled(Input)``;

const PitchTopicPage = (props) => {

    document.body.style.background = '#eee';

    const { pitch_id } = props.location.state;

    const [refresh, setRefresh] = useState(false);
    const [pitch, setPitch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newPitchTopicName, setNewPitchTopicName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [redirectToProfile, setRedirectToProfile] = useState(false);
    const [showMetricsExplanationModal, setShowMetricsExplanationModal] = useState(false);

    const [showSavingSpinner, setShowSavingSpinner] = useState(false);
   
    // trigger useEffect when a new note is successfuly saved
    const [newlyCreatedNote, setNewlyCreatedNote] = useState();

    // we pass this down to <PitchNotes />. We want the notes to update if a recording was just deleted. We set it from <MetricsTable />>
    const [refreshNotes, setRefreshNotes] = useState()

    // state for metrics. Can't use let, since each render will reset them
    const [pitchSpeechRateData, setPitchSpeechRateData] = useState([]);
    const [pitchPronunciationPosterioriScoreData, setPitchPronunciationPosterioriScoreData] = useState([]);
    const [pitchSpeakingRatioData, setPitchSpeakingRatioData] = useState([]);
    const [pitchPausesCountData, setPitchPausesCountData] = useState([]);
    const [pitchOriginalDurationData, setPitchOriginalDurationData] = useState([]);

    // state for filler words
    const [fillerWordsData, setFillerWordsData] = useState([]);

    // popper
    const [visible, setVisibility] = useState(false);

    const referenceRef = useRef(null);
    const [arrowElement, setArrowElement] = useState(null);
    const popperRef = useRef(null);

    // Pagination for Audio files/notes
    const [audioFiles, setAudioFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [audioFilesPerPage, setAudioFilesPerPage] = useState(5);



    // to close the popup 
    useOnClickOutside(popperRef, () => setVisibility(false) );

    const { styles, attributes } = usePopper(referenceRef.current, popperRef.current, {
        placement: "left",
        modifiers: [
            {
                name: "offset",
                enabled: true,
                options: {
                    offset: [0, 0]
                }
            }, {
                name: 'arrow',
                options: { element: arrowElement }
            }
        ]
    });
  
    const { addToast } = useToasts();

    function editMetricsForCharts(metricsList) {

        let temp = [{
            id: "pronunciation score"
        }];

        temp[0].data = metricsList.map(function (pitchMetric) {
            return {
                x: pitchMetric.pitch_name, 
                y: pitchMetric.pronunciation_posteriori_probability_score_percentage
            }
         });

        setPitchPronunciationPosterioriScoreData(temp);

        temp = [{
            id: "pauses count"
        }];

        temp[0].data = metricsList.map(function (pitchMetric) {
            return {
                x: pitchMetric.pitch_name, 
                y: pitchMetric.pauses_count
            }
         });

        setPitchPausesCountData(temp);

        temp = [{
            id: "rate of speech"
        }];

        temp[0].data = metricsList.map(function (pitchMetric) {
            return {
                x: pitchMetric.pitch_name, 
                y: pitchMetric.rate_of_speech
            }
         });
         
        setPitchSpeechRateData(temp);

        temp = [{
            id: "articulation rate"
        }];

        temp[0].data = metricsList.map(function (pitchMetric) {
            return {
                x: pitchMetric.pitch_name, 
                y: pitchMetric.articulation_rate
            }
         });
         
        setPitchSpeakingRatioData(temp);

        temp = [{
            id: "original duration"
        }];

        temp[0].data = metricsList.map(function (pitchMetric) {
            return {
                x: pitchMetric.pitch_name, 
                y: pitchMetric.original_duration
            }
         });
        
        setPitchOriginalDurationData(temp);
    }

    useEffect(() => {
        getPageData()
            .then(([pitchTopic, pitchMetrics, fillerWords]) => {
                setPitch(pitchTopic);
                setFillerWordsData(fillerWords)
                editMetricsForCharts(pitchMetrics);
                // we will set the Pitch name dynamically, instead of doing it in the backend. That way, 
                // we don't have to worry about updating the names when deletes happen
                setAudioFiles(pitchTopic.audio_files.map((item ,index) => {
                    let copyOfObject = Object.assign({}, item);
                    copyOfObject.name= `Pitch ${index+1}`;
                    return copyOfObject;
                }));
                setIsLoading(false);
                setShowSavingSpinner(false);
            })
    }, [refresh]); // we want this to run whenever successful update. This is going to run whenever edit modal is opened or closed

    function getPageData() {
        //setIsLoading(true);
        // this promise will resolve when all of the input's promises have resolved
        return Promise.all([getPitchTopic(), getPitchMetrics(), getFillerWordsData()])
    }

    function getPitchTopic() {
        return fetch(API_URL + "api/pitchtopics/" + pitch_id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(response => response.json())  
    }

    function getPitchMetrics() {
        return fetch(API_URL+"api/pitchtopics/"+pitch_id+"/metrics?sort=date_recorded", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(response => response.json())
    }

    function getFillerWordsData() {
        return fetch(API_URL+"api/pitchtopics/"+pitch_id+"/metrics/fillerwords", {
            methods: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            credentials: 'include'
        }).then(response => response.json())
    }

    let handlePitchTopicUpdate = (e) => {
        
        if(!newPitchTopicName) {
            alert('No changes have been made!')
        } else {
            fetch(API_URL+"api/pitchtopics/"+pitch.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookie.get('csrftoken')
                },
                body: JSON.stringify({newPitchTopicName: newPitchTopicName}), // remove any white space from this string?
                credentials: 'include'
            })
            .then(response => {
                if (response.status === 200) {
                    addToast('Pitch Topic updated', { appearance: 'success', autoDismiss: true});
                    return response.json();
                } else if(response.status === 409) {
                    addToast('A pitch topic with that name already exists!', { appearance: 'error', autoDismiss: true});
                    return Promise.reject(response.statusText);
                }
            })
            .then(parsedResponse => { setShowEditModal(false); setNewPitchTopicName(''); setRefresh(!refresh)})
            .catch(error => console.log(error));
        }
    }

    function handleDeletePitchTopic(e) {
        fetch(API_URL+"api/pitchtopics/"+pitch.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': Cookie.get('csrftoken')
            },
            credentials: 'include' // once we include this, we need to send CSRF token
        })
        .then(res => {
            if (res.status === 200) {
                addToast('Pitch Topic deleted', { appearance: 'success', autoDismiss: true});
                setRedirectToProfile(true); 
            }
            return res.json()
        })
        .then(parsedJson => null);
    }

    const handleEditModalShow = () => { setShowEditModal(true)};
    const handleEditModalClose = () => { setShowEditModal(false) };

    const handleDeleteModalShow = () => { setShowDeleteModal(true)};
    const handleDeleteModalClose = () => { setShowDeleteModal(false) };

    if (isLoading) {
        return null;
    }

    let savingSpinner;
    if (showSavingSpinner) {
        savingSpinner = <CircleSpinner />
    } else {
        savingSpinner = null;
    }

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get current posts
    const indexOfLastAudioFile = currentPage * audioFilesPerPage;
    const indexOfFirstAudioFile = indexOfLastAudioFile - audioFilesPerPage;
    const currentAudioFiles = audioFiles.slice(indexOfFirstAudioFile, indexOfLastAudioFile);
    
    return (
        <Container>
            { redirectToProfile && <Redirect to={{ pathname: "/profile" }} /> }

            {savingSpinner}

            <Banner></Banner>

            <h1 class="center-heading">{pitch.name}</h1>

            <ButtonsContainer>
                <div class='icon-container' ref={referenceRef} onClick={() => setVisibility(!visible)}>
                    <AddNewItemToPitchIcon icon={faPlus} />
                </div>
                <div class='icon-container'>
                    <EditIcon icon={faEdit} onClick={handleEditModalShow} />
                </div>
                <div class='icon-container'>
                    <DeleteIcon icon={faTrash} onClick={handleDeleteModalShow} />
                </div>
            </ButtonsContainer>

            <PopoverContainer ref={popperRef} style={styles.popper} {...attributes.popper} visible={visible}>
                <div class="header">Add to Pitch</div>
                <div class="body">
                    <ChoicesBox style={styles.offset}>
                        <ChoiceItem>
                            <StyledLink style={{ textDecoration: 'none' }} to={{ pathname: '/profile/audio/record/', state: { pitch_from_pitch_topic_page: pitch } }}>
                                Record new pitch
                            </StyledLink>
                        </ChoiceItem>
                    </ChoicesBox>
                    <div class="arrow" ref={setArrowElement} style={styles.arrow}></div>
                </div>
            </PopoverContainer>

            <MetricsTable 
                audioList={pitch.audio_files}
                fillerWordsData={fillerWordsData} 
                triggerUseEffectFromChild={() => setRefresh(!refresh)} 
                setShowSavingSpinnerFromChild={() => setShowSavingSpinner(true) }
                // setNewlyCreatedNoteFromChildFunction={(note) => setNewlyCreatedNote(note) }
            />
            
            <span class="pitches-count-label">There are <b>{pitch.audio_files.length} pitches</b> under this pitch topic</span>

            <NotesContainer>
                <h3>Notes for pitch</h3>
                <PitchNotes audioFiles={currentAudioFiles} triggerUseEffectFromChild={() => setRefresh(!refresh)} setShowSavingSpinnerFromChild={() => setShowSavingSpinner(true) }/>
                {/* <PitchNotes pitchTopicId={pitch.id} audioFiles={currentAudioFiles} noteJustAdded={newlyCreatedNote} pitchJustDeleted={refreshNotes} /> */}
                <Pagination audioFilesPerPage={audioFilesPerPage} totalAudioFiles={audioFiles.length} paginate={paginate} />
            </NotesContainer>
           
            <h1 class="center-heading">Charts</h1>
            <InfoIconContainer>
                <InfoIcon icon={faInfo} size="2x" data-tip="Metrics explanation" onClick={() => setShowMetricsExplanationModal(true)} />
            </InfoIconContainer>
            <ReactTooltip />

            {pitch.audio_files.length === 0 ? (
                <NoPitchesRecordedInfoBoxContainer>
                    <NoPitchesRecordedInfoBox>
                        <h1>Oops!</h1>
                        Record some files to see the following!
                        <ul>
                            <li>Rate of speech</li>
                            <li>Pronunciation posteriori probability score percentage</li>
                            <li>Mood of speech</li>
                        </ul>
                        <span>And many more!</span>
                    </NoPitchesRecordedInfoBox>
                </NoPitchesRecordedInfoBoxContainer>
               
            ) : (
                <ChartsGrid 
                    pitchPronunciationPosterioriScoreData={pitchPronunciationPosterioriScoreData}
                    pitchPausesCountData={pitchPausesCountData}
                    pitchSpeechRateData={pitchSpeechRateData}
                    pitchSpeakingRatioData={pitchSpeakingRatioData}
                    pitchOriginalDurationData={pitchOriginalDurationData}
                />
            )}

            <MetricsExplanationModal 
                visible={showMetricsExplanationModal} 
                closeModalFromChild={() => setShowMetricsExplanationModal(false)}
            />

            <Modal show={showEditModal} closeModalFromChild={() => setShowEditModal(false)}>
                <ModalHeader>Edit Pitch Name</ModalHeader>

                <ModalBody>
                    <p>Give a new name!</p>
                    <NewPitchTopicNameInput type="text" name="pitchtopicname" placeholder={pitch.name} value={newPitchTopicName} required onChange={(e) => setNewPitchTopicName(e.target.value)} />
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleEditModalClose}>Cancel</Button>
                    <Button variant="primary" onClick={handlePitchTopicUpdate}>Save Changes</Button>
                </ModalFooter>
            </Modal>

            <Modal show={showDeleteModal} closeModalFromChild={() => setShowDeleteModal(false)}>
                <ModalHeader>Confirm Delete</ModalHeader>

                <ModalBody>
                    <p>Are you sure you want to delete <b>{pitch.name}</b>? Any audio files associated with this pitch will be deleted</p>
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeletePitchTopic}>Delete</Button>
                </ModalFooter>
            </Modal>

        </Container>
    );
}

export default PitchTopicPage;