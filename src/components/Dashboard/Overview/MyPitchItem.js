import React, { useState, useRef } from 'react';
import { API_URL } from '../../../constants.js';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faEllipsisV, faPlay, faPause, faDownload } from '@fortawesome/free-solid-svg-icons';
import { usePopper } from 'react-popper';
import useOnClickOutside from '../../shared_components/hooks/useOnClickOutside.js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../shared_components/Modal.js';
import { Button } from '../../shared_components/Button.js';
import RichTextEditor from '../../shared_components/RichTextEditor.js';
import { useToasts } from 'react-toast-notifications';
import ImprovementEngineModal from './ImprovementEngineModal/';

const StyledMyPitchItem = styled.div`
    // to position <EllipsisIcon>
    position: relative;
    padding: 20px;

    .name-date-improvement {
        display: flex;

        .name-date {
            display: flex;
            flex-direction: column;
            color: #fff;
            font-size: 25px;
            font-weight: 700;
            letter-spacing: 1px;
            text-shadow: 1px 1px black;
    
            .date {
                font-size: 50%;
                position: relative;
                bottom: 0;
            }
        }

        .improvement-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }

    .ellipsis-container {
        background-color: rgb(255, 255, 255);
    }

    .popover-container {
        display: ${props => props.visible ? 'flex' : 'none'};
        flex-direction: column;
        border: 2px solid white;
        z-index: 2;
        background-color: rgb(255, 255, 255, 0.6);
        border-radius: 15px;
        padding: 10px;
    }
`;

const EllipsisIcon = styled(FontAwesomeIcon)`
    position: absolute;
    color: #fff;
    right: 3%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
`;

const EditPitchIcon = styled(FontAwesomeIcon)`
    cursor: pointer;

    &:hover {
        color: #7DB0DB;
    }
`;

const PlayIcon = styled(EditPitchIcon)``;

const StopIcon = styled(EditPitchIcon)``;

const AddNoteIcon = styled(EditPitchIcon)``;

const DeletePitchIcon = styled(EditPitchIcon)``;

const DownloadPitchIcon = styled(EditPitchIcon)``;

const initialValue = [
    {
        children: [
          { text: 'This is editable plain text, just like a <textarea>!' },
        ],
      },
]

const MyPitchItem = ({ pitch, index, ...props }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activatedPlayButtonIndex, setActivatedPlayButtonIndex] = useState(-1);
    const [showCreateNewNoteModal, setShowCreateNewNoteModal] = useState(false);
    const [pitchNameToDelete, setPitchNameToDelete] = useState('');
    const [showImprovementEngineModal, setShowImprovementEngine] = useState(false);
    // const [improvementReportObjectList, setImprovementReportObjectList] = useState([]);

    const [value, setValue] = useState(initialValue);
    const { addToast } = useToasts();
    // popper
    const [visible, setVisibility] = useState(false);
    const referenceRef = useRef(null);
    const [arrowElement, setArrowElement] = useState(null);
    const popperRef = useRef(null);

     // to close the popup
    useOnClickOutside(popperRef, () => setVisibility(false) );

    const { styles, attributes } = usePopper(referenceRef.current, popperRef.current, {
        placement: "right",
        modifiers: [
            {
                name: "offset",
                enabled: true,
                options: {
                    offset: [-20, 10]
                }
            }, {
                name: 'arrow',
                options: { element: arrowElement }
            }
        ]
    });

    function handlePlayPitchButtonClick(audio, index) {
        // pause any audio element currently playing
        let audioElements = document.getElementsByTagName('audio');
        for(let i = 0; i < audioElements.length; i++) {
            audioElements[i].pause();
        }

        setActivatedPlayButtonIndex(index);
        document.getElementById('audio-'+index).play();
    }

    function handlePausePitchButtonClick(index) {
        setActivatedPlayButtonIndex(-1); 
        document.getElementById('audio-'+index).pause();
    }
    
    const handleSaveNote = e => {
        let contentToSave = JSON.stringify(value);
       
        fetch(API_URL + `api/audio/${pitch.id}/notes`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookie.get('csrftoken')
            }, 
            body: JSON.stringify({ content: contentToSave }),
            credentials: 'include'
        }).then(response => {
            if(response.status === 201) {
                addToast('Note successfully created', { appearance: 'success', autoDismiss: true});
                return response.json();
            }
        }).then(parsedResponse => {
            props.setRefreshFromChild();
            setShowCreateNewNoteModal(false);
        }).catch(error => console.log(error));
    }

    function handleDeleteAudio() {
        fetch(API_URL+"api/audio/"+pitch.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': Cookie.get('csrftoken')
            },
            credentials: 'include' // once we include this, we need to send CSRF token
        })
        .then(res => {
            if(res.status === 200) {
                addToast('Pitch successfully deleted', { appearance: 'success', autoDismiss: true});
                props.setRefreshFromChild();
                return res.json()
            }
        })
        .then(parsedJson => { setShowDeleteModal(false); })
    }

    const handleDownloadPitch = (pitch) => {
        fetch(API_URL+"api/audio/"+pitch.id+"/download", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': Cookie.get('csrftoken') // Don't need since its a GET request
            },
            credentials: 'include' // once we include this, we need to send CSRF token
        })
        .then(response => {
            if(response.status === 200) {
                return response.blob()
            }
        })
        .then(response => {
            const blob = new Blob([response], {type: 'audio/wav'});
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "audio.wav";
            document.body.appendChild(a);
            a.click();
        })
    }

    const handleImprovementReportButtonClick = () => {

        // let metricsPriority = [
        //     {
        //         metric: "rate_of_speech", 
        //         nameToDisplay: "Words per Minute", 
        //         needsImprovement: false, 
        //         valueBeforeImprovement: 0, 
        //         promptOnImprovementPage: "Looks like you talked a little (fast, slow) in your pitch. Let's work on that. Here are a couple of examples of pitches where the speaker has a good speaking rate. Click next to practice and improve!",
        //         tips: ["Tip 1", "Tip 2", "Tip 3"], 
        //         goalValue: 100
        //     }, 
        //     {
        //         metric: "pronunciation_score", 
        //         nameToDisplay: "Pronunciation Score", 
        //         needsImprovement: false, 
        //         valueBeforeImprovement: 0, 
        //         promptOnImprovementPage: "Prompt", 
        //         tips: ["Tip 1", "Tip 2", "Tip 3"], 
        //         goalValue: 100
        //     }, {
        //         metric: "pause_score", 
        //         nameToDisplay: "Pause Score",
        //         needsImprovement: false, 
        //         valueBeforeImprovement: 0, 
        //         promptOnImprovementPage: "Prompt", 
        //         tips: ["Tip 1", "Tip 2", "Tip 3"], 
        //         goalValue: 100
        //     }, {
        //         metric: "pauses_count", 
        //         nameToDisplay: "Pauses Count", 
        //         needsImprovement: false, 
        //         valueBeforeImprovement: 0, 
        //         promptOnImprovementPage: "Prompt", 
        //         tips: ["Tip 1", "Tip 2", "Tip 3"], 
        //         goalValue: 100
        //     }, {
        //         metric: "filler_words_score", 
        //         nameToDisplay: "Filler words score", 
        //         needsImprovement: false, 
        //         valueBeforeImprovement: 0, 
        //         promptOnImprovementPage: "Prompt", 
        //         tips: ["Tip 1", "Tip 2", "Tip 3"], 
        //         goalValue: 100
        //     }
        // ]
    
        // let keys = metricsPriority.map((el => el.metric));
        // for (const metricProperty of keys) {
        //     let improve = metricNeedsToBeImproved(metricProperty)

        //     if(improve) {
        //         let index = metricsPriority.findIndex(obj => obj.metric == metricProperty);
        //         metricsPriority[index].needsImprovement = true;
        //         metricsPriority[index].valueBeforeImprovement = pitch.metrics[metricProperty];
        //     }
        // }
        // setImprovementReportObjectList(metricsPriority);
        setShowImprovementEngine(!showImprovementEngineModal);
    }

    // const metricNeedsToBeImproved = (metricProperty) => {
        
    //     let metric = pitch.metrics[metricProperty];

    //     switch (metricProperty) {
    //         case 'rate_of_speech':
    //             if(parseFloat(metric) >= 130.00 && parseFloat(metric) <= 150.00) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         case 'pronunciation_score':
    //             if(parseFloat(metric) >= .90 && parseFloat(metric) <= 1.00) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         case 'pause_score':
    //             if(parseFloat(metric) >= 90 && parseFloat(metric) <= 100) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         case 'pauses_count':
    //             if(parseFloat(metric) >= 90 && parseFloat(metric) <= 100) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         case 'filler_words_score':
    //             if(parseFloat(metric) >= 90 && parseFloat(metric) <= 100) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //     }
    // }

    return (
        <StyledMyPitchItem visible={visible}>
            <div class="name-date-improvement">
                <div class="name-date">
                    <span>{pitch.name}</span>
                    <span class="date">{pitch.date_recorded}</span>
                </div>

                <div>
                    <span class="improvement-button" onClick={handleImprovementReportButtonClick}>Improvement Report</span>
                </div>
            </div>
            
            <div class="ellipsis-container" ref={referenceRef} onClick={() => setVisibility(!visible)}>
                <EllipsisIcon icon={faEllipsisV} size="2x" />
            </div>
            
            <div class="popover-container" ref={popperRef} style={styles.popper} {...attributes.popper}>
                {activatedPlayButtonIndex === index
                        ?
                        <div><StopIcon icon={faPause} size="2x" onClick={(event) =>  { handlePausePitchButtonClick(index); event.stopPropagation(); } } /></div>
                        :
                        <div><PlayIcon icon={faPlay} size="2x" onClick={(event) => { handlePlayPitchButtonClick(pitch, index); event.stopPropagation(); } }  /></div>
                }

                <audio id={`audio-${index}`} src={pitch.s3_url}></audio>
                <div><AddNoteIcon icon={faPlus} size="2x" onClick={(event) => { setShowCreateNewNoteModal(true); event.stopPropagation(); } } /></div>
                <div><DeletePitchIcon icon={faTrash} size="2x" onClick={(event) => { setShowDeleteModal(true); setPitchNameToDelete(`Pitch-${index+1}`); event.stopPropagation(); }} /></div>
                <div><DownloadPitchIcon icon={faDownload} size="2x" onClick={() => handleDownloadPitch(pitch)} /></div>
                {/* <div><a href={pitch.s3_url} download="pitch.wav"><DownloadPitchIcon icon={faDownload} size="2x" /></a></div> */}
            </div>

            <Modal backgroundColor='#eee' show={showCreateNewNoteModal} closeModalFromChild={() => setShowCreateNewNoteModal(false)}>
                <ModalHeader>Create new note</ModalHeader>

                <ModalBody>
                    <RichTextEditor
                        setValueFromChild={(val) => setValue(val)}
                        valueFromParent={value}
                    />
                   
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={() => setShowCreateNewNoteModal(false) }>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveNote}>Save Changes</Button>
                </ModalFooter>
            </Modal>

            <Modal show={showDeleteModal} closeModalFromChild={() => setShowDeleteModal(false)}>
                <ModalHeader>Confirm Delete</ModalHeader>
                
                <ModalBody>
                    <p>Are you sure you want to delete <b>{pitchNameToDelete}</b>?</p>
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteAudio}>Delete</Button>
                </ModalFooter>
            </Modal>

            <ImprovementEngineModal show={showImprovementEngineModal} closeModalFromChild={() => setShowImprovementEngine(false) } pitch={pitch} />
        </StyledMyPitchItem>
    );
}

export default MyPitchItem;