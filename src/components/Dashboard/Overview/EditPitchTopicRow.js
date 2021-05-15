import React, { useState } from 'react';
import { API_URL } from '../../../constants.js';
import styled from 'styled-components';
import Cookie from 'js-cookie';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../shared_components/Modal.js';
import { Button } from '../../shared_components/Button.js';
import { Input } from 'antd';
import ReactTooltip from "react-tooltip";
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

const Container = styled.div``;

const ButtonsContainer = styled.div`
    display: flex;
    //justify-content: center;
    font-size: 15px;
    //margin: 0 -8px;
    margin: 20px;

    & > * {
        margin: 0 8px;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #595959;
    
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

const ButtonIcon = styled(FontAwesomeIcon)`
    font-size: 25px;
	margin: 5px;
    color: white;
    
    &:hover {
        cursor: pointer;
        color: #000000;
    }
`;

const RecordNewPitchIcon = styled(ButtonIcon)``;

const EditIcon = styled(ButtonIcon)``;

const DeleteIcon = styled(ButtonIcon)``;

const NewPitchTopicNameInput = styled(Input)``;

const EditPitchTopicRow = (props) => {
    // the currently selected pitch topic
    const selectedPitchTopic = useStoreState(store => store.selectedPitchTopic);
    // set the currently selected pitch topic
    const selectPitchTopic = useStoreActions(actions => actions.selectedPitchTopic.setPitchTopic)
    const { addToast } = useToasts();

    const [showEditModal, setShowEditModal] = useState(false);
    const [newPitchTopicName, setNewPitchTopicName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const handleEditModalShow = () => { setShowEditModal(true)};
    const handleEditModalClose = () => { setShowEditModal(false) };
    const handleDeleteModalShow = () => { setShowDeleteModal(true)};
    const handleDeleteModalClose = () => { setShowDeleteModal(false) };
    
    let handlePitchTopicUpdate = (e) => {
        
        if(!newPitchTopicName) {
            alert('No changes have been made!')
        } else {
            fetch(API_URL+"api/pitchtopics/"+selectedPitchTopic.pitchTopic.id, {
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
            .then(parsedResponse => { setShowEditModal(false); selectedPitchTopic.pitchTopic.name = newPitchTopicName; setNewPitchTopicName(''); props.setRefreshFromChild(); /*setRefresh(!refresh)*/})
            .catch(error => console.log(error));
        }
    }

    function handleDeletePitchTopic(e) {
        fetch(API_URL+"api/pitchtopics/"+selectedPitchTopic.pitchTopic.id, {
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
                selectPitchTopic({});
                //props.setRefreshFromChild();
            }
            return res.json()
        })
        .then(parsedJson => { setShowDeleteModal(false); props.setRefreshFromChild(); });
    }

    return(
        <Container>
            <ButtonsContainer>
                <div>
                    <StyledLink style={{ textDecoration: 'none' }} to={{ pathname: '/dashboard/record/', state: { pitch_from_pitch_topic_page: selectedPitchTopic.pitchTopic } }}>
                        <RecordNewPitchIcon icon={faMicrophone} data-tip={`Add new pitch to ${selectedPitchTopic.pitchTopic.name}`} />
                    </StyledLink>
                </div>
                <div>
                    <EditIcon icon={faEdit} onClick={handleEditModalShow} data-tip="Edit pitch topic name" />
                </div>
                <div>
                    <DeleteIcon icon={faTrash} onClick={handleDeleteModalShow} data-tip="Delete pitch topic"  />
                </div>
                <ReactTooltip />
            </ButtonsContainer>

            <Modal show={showEditModal} closeModalFromChild={() => setShowEditModal(false)}>
                <ModalHeader>Edit Pitch Name</ModalHeader>

                <ModalBody>
                    <p>Give a new name!</p>
                    <NewPitchTopicNameInput type="text" name="pitchtopicname" placeholder={selectedPitchTopic.pitchTopic.name} value={newPitchTopicName} required onChange={(e) => setNewPitchTopicName(e.target.value)} />
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleEditModalClose}>Cancel</Button>
                    <Button variant="primary" onClick={handlePitchTopicUpdate}>Save Changes</Button>
                </ModalFooter>
            </Modal>

            <Modal show={showDeleteModal} closeModalFromChild={() => setShowDeleteModal(false)}>
                <ModalHeader>Confirm Delete</ModalHeader>

                <ModalBody>
                    <p>Are you sure you want to delete <b>{selectedPitchTopic.pitchTopic.name}</b>? Any audio files associated with this pitch will be deleted</p>
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeletePitchTopic}>Delete</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}

export default EditPitchTopicRow;