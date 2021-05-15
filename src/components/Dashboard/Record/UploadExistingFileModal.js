import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { API_URL } from '../../../constants.js';
import Cookie from 'js-cookie';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import {useDropzone} from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from 'react-toast-notifications';

const GrayOutViewPort = styled.div`
    display: ${({ show }) => show ? 'block' : 'none'};
    opacity: 0.5; 
    background: #000; 
    width: 100%;
    height: 100%; 
    top: 0; 
    left: 0; 
    position: fixed; 
    z-index: 2;
`;

const StyledModal = styled.div`
    background-color: #FFFFFF;
    border: 1px #e8e8e8 solid;
    border-radius: 3px;
    display: ${props => {
        if (props.showModal === true) {
            return 'block';
        }
        else {
            return 'none';
        }
    }}

    width: 50%;
    padding: 16px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;

    h1 {
        text-align: center;
    }
`;

const CloseIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: 2px;
    right: 2px;
    cursor: pointer;

    &:hover {
        color: #0366d6;
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

 const Button = styled.div`
    color: #FFFFFF
    border: 2px solid black;
    margin: 0 5px;
    border-radius: 5px;
    padding: 7px;
    transition: 0.3s;
`

const CancelButton = styled(Button)`
    cursor: pointer;
    background-color: #DC3545;

    &:hover {
        background-color: #B72C3A
    }
`;

const SaveButton = styled(Button)`
    background-color: ${({disable}) => disable ? '#696969' : '#007BFF;'};       
    cursor: pointer; 
    pointer-events: ${({disable}) => disable ? 'none' : 'auto'};

    &:hover {
        background-color: #005EC4;
    }
`;

const UploadExistingFileModal = ({showModal, pitchTopic, closeModalFromChild, showSpinnerOnAudioRecordingPage}) => {
    
    const [redirect,  setRedirect] = useState(false);
    const [files, setFiles] = useState(null);
    
    const onDrop = useCallback(acceptedFiles => {
        // if (acceptedFiles.length === 1) {
        //     setFiles(acceptedFiles)
        // }
        setFiles(acceptedFiles);
    }, []);

    const { addToast } = useToasts();

    function onSave() {

        closeModalFromChild();
        showSpinnerOnAudioRecordingPage(true);
    
        if (acceptedFiles.length === 1) {
           uploadSingleFile()
        } else if (files.length > 1) {
            uploadMultipleFiles()
        } else {
            alert("No files selected")
        }
    }
    
    function uploadSingleFile() {
        //let file = new File(files[0], "");

        let headers = new Headers();
        headers.append('X-CSRFToken', Cookie.get('csrftoken'));
        headers.append('Accept', 'application/json')
        let formData = new FormData();

        formData.append("audio_file", files[0], "uploaded_audio");
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
                    if(response.status === 202) {
                        addToast('1 file successfully uploaded', { appearance: 'success', autoDismiss: true});
                        setRedirect(true);
                    } else if(response.status === 409) {
                        showSpinnerOnAudioRecordingPage(false);
                        addToast(jsonResponse['msg'], { appearance: 'error', autoDismiss: true});
                    }
                    else if(response.status === 500) {
                        showSpinnerOnAudioRecordingPage(false);
                        addToast('Audio upload failed', { appearance: 'error', autoDismiss: true});
                    }
                })
            })

        // fetch(API_URL+"api/upload_audio", requestOptions)
        //     .then(response => {
        //         if (response.status === 202) {
        //             addToast('1 File successfully uploaded', { appearance: 'success', autoDismiss: true});
        //             setRedirectToProfile(true);
        //         } else if (response.status === 409) {
        //             // showSpinnerOnAudioRecordingPage(false);
        //             // TODO: Reset so they can record again
        //         }
        //         return response.text()
        //     })
        //     .then(result => result )
        //     .catch(error => console.log('error', error));
    }

    function uploadMultipleFiles() {
        let headers = new Headers();
        headers.append('X-CSRFToken', Cookie.get('csrftoken'));
        headers.append('Accept', 'application/json')
        let formData = new FormData();

        for (const file of files) {
            formData.append('file[]', file, file.name);
        }

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
                    if(response.status === 202) {
                        addToast(`${jsonResponse.length} files successfully uploaded`, { appearance: 'success', autoDismiss: true});
                        setRedirect(true);
                    } else if (response.status === 409) {
                        showSpinnerOnAudioRecordingPage(false);
                        addToast(jsonResponse['msg'], { appearance: 'error', autoDismiss: true});
                    }
                })
            });

        // fetch(API_URL+"api/upload_audio", requestOptions)
        //     .then(response => {
        //         if (response.status === 202) {
        //             setRedirectToProfile(true);
        //         } else if (response.status === 409) {
        //             // showSpinnerOnAudioRecordingPage(false);
        //             // TODO: Reset so they can record again
        //         }
        //         return response.text()
        //     })
        //     .then(result => result)
        //     .catch(error => console.log('error', error));

        
    }

    const {acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({onDrop, accept: 'audio/wav'});

    const filesList = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));


    let disableSaveButton;
    if (pitchTopic.title && acceptedFiles.length > 0)
        disableSaveButton = false;
    else
        disableSaveButton = true;

    return (
        <div>

            <GrayOutViewPort show={showModal} />
            
            <StyledModal showModal={showModal}>
                { redirect && <Redirect to={{ pathname: "/dashboard/overview" }} /> }

                <h1>Upload existing audio</h1>
                <h3>{pitchTopic.name}</h3>
                
                <CloseIcon icon={faTimes} size="2x" onClick={() => closeModalFromChild()} />
                
                <DropZoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </DropZoneContainer>

                <div>
                    <h4>Files</h4>
                    <ul>{filesList}</ul>
                </div>

                <ButtonsContainer>
                    <CancelButton onClick={() => { closeModalFromChild() }}>Cancel</CancelButton>
                    <SaveButton disable={disableSaveButton} onClick={onSave}>Save</SaveButton>
                </ButtonsContainer>
            </StyledModal>

        </div>
    );
}

export default UploadExistingFileModal