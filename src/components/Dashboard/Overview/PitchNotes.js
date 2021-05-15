import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Cookie from 'js-cookie';
import { Text } from 'slate';
import { API_URL } from '../../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import escapeHtml from 'escape-html';
import { useToasts } from 'react-toast-notifications';

const PitchNotesAccordionContainer = styled.div`
    background-color: rgb(255, 255, 255, 0.1);
	box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.19);
	border-radius: 15px;
	border: 1px solid #FFFFFF;
	margin: 10px;
`;

const PitchNotesAccordion = styled.div` `;

const PitchNotesAccordionHeader = styled.div`
    padding: 20px;
    cursor: pointer;
    color: #fff;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 1px 1px black;

    .number_of_notes {
        float: right;
    }

    // this has to go before &:hover{}
    ${function (props) {
        if (props.currentIndex === 1) {
            return css`
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            `
        } else if (props.currentIndex === props.numberOfItemsInList) {
            if(props.activatedIndex===props.currentIndex-1) {
                return css`
                    border-bottom-left-radius: 0px;
                    border-bottom-right-radius: 0px;
            `
            } else {
                return css`
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
            `
            }
        }
    }
}
    &:hover {
		color: #fff;
		background-color: rgb(0, 0, 0, 0.1);
	}

    color: ${(props) => props.activatedIndex==props.currentIndex-1 && '#fff'};
    // for some reason, this has to be after .number_of_notes
    background-color: ${(props) => props.activatedIndex===props.currentIndex-1 && '#868585'};
`;

const PitchNotesAccordionBody = styled.div`
    max-height: ${props => props.show && props.index === props.activatedIndex ? '300px' : '0px'};
    transition: max-height 0.35s ease;
    overflow-y: auto;
`;

const PitchNoteItem = styled.div`
    // To position <DeleteNoteIcon />
    position: relative;
	padding: 20px;
`;

const DeleteNoteIcon = styled(FontAwesomeIcon)`
    position: absolute;
    right: 0;
    margin-bottom: 25px;
    font-size: 15px;
    
    &:hover {
        color: #dc3545;
        cursor: pointer;
    }
`;

const PitchNotes = (props) => {
    const [showCollapsible, setShowCollapsible] = useState(false);
    const [activatedIndex, setActivatedIndex] = useState(-1);

    const { addToast } = useToasts();

    const handleDeleteNote = (id) => {
        fetch(API_URL+`api/audio/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': Cookie.get('csrftoken')
            },
            credentials: 'include' // once we include this, we need to send CSRF token
        })
        .then(res => {
            if (res.status === 204) {
                addToast('Note deleted', { appearance: 'success', autoDismiss: true});
                props.setRefreshFromChild();
            } else if(res.status === 404) {
                addToast('Note not found', { appearance: 'error', autoDismiss: true});
            }
        })
    }

    const serialize = node => {

        if (Text.isText(node)) {
            if(node.underline && node.bold) {
                return `<u><b>${node.text}</ul></b>`;
            } else if(node.underline) {
                return `<u>${node.text}</u>`;
            } else if(node.bold) {
                return `<b>${node.text}</b>`;
            } else {
                return escapeHtml(node.text);
            }
        }

        const map_obj = (Array.isArray(node)) ? node: node.children;
        const children = map_obj.map(n => serialize(n)).join('');

        switch (node.type) {
            case 'quote':
                return `<blockquote><p>${children}</p></blockquote>`
            case 'heading-one':
                return `<h1>${children}</h1>`
            case 'paragraph':
                return `<p>${children}</p>`
            case 'link':
                return `<a href="${escapeHtml(node.url)}">${children}</a>`
            case 'numbered-list':
                return `<ol>${children}</ol>`
            case 'bulleted-list':
                return `<ul>${children}</ul>`
            case 'list-item':
                return `<li>${children}</li>`
            default:
                return children
        }
    }
    
    const handleAccordionHeaderClick = (index) => {
        setShowCollapsible(!showCollapsible);
        
        if(activatedIndex === -1) {
            setActivatedIndex(index);
        } else {
            setActivatedIndex(-1);
        }
    }

    return (
        <PitchNotesAccordionContainer>
            {
                props.audioFiles.map((audio, index) => (
                    <PitchNotesAccordion key={index}>
                        <PitchNotesAccordionHeader onClick={() => handleAccordionHeaderClick(index)} currentIndex={index+1} numberOfItemsInList={props.audioFiles.length} activatedIndex={activatedIndex}>
                            {audio.name}
                            <span class="number_of_notes">{`${audio.notes.length} notes`}</span>
                        </PitchNotesAccordionHeader>

                        <PitchNotesAccordionBody show={showCollapsible} index={index} activatedIndex={activatedIndex}>
                            {
                                audio.notes.map((note, note_index) => (
                                    <PitchNoteItem key={note_index}>
                                        <div dangerouslySetInnerHTML={{__html: serialize(JSON.parse(note.content))}}></div>
                                        <DeleteNoteIcon icon={faTrash} onClick={() => handleDeleteNote(note.id)} />
                                    </PitchNoteItem>
                                ))
                            }
                        </PitchNotesAccordionBody>
                    </PitchNotesAccordion>
                ))
            }
        </PitchNotesAccordionContainer>
    );
}

export default PitchNotes;