import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCheck } from '@fortawesome/free-solid-svg-icons';
import useOnClickOutside from '../shared_components/hooks/useOnClickOutside.js';

const Container = styled.div`
    width: 222px;
    // To position <List /> relative to this
    position: relative;
`;

const Header = styled.div`
    border: 1px solid #dfdfdf;
    // To position icon relative to the header
    position: relative;
    padding: 15px 0;
    cursor: pointer;
    // disable highlighting of text when clicking
    user-select: none;

    span {
        margin: 2px 20px;
	    margin-right: 30px;
	    font-weight: 300;
    }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    position: absolute;
    right: 10px;
`;

const SearchBar = styled.input`
    width: 100%;
    height: 40px;
    padding: 0 10px;
    border-top: none;
    border-right: none;
    border-left: none;
    font-size: inherit;
`;

const List = styled.div`
    display: ${({ open }) => open ? 'block' : 'none'}
    overflow-y: scroll;
    overflow-x: hidden;
    position: absolute;
	width: 100%;
	max-height: 215px;
	border: 1px solid #dfdfdf;
	border-top: none;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
	box-shadow: 0 2px 5px -1px #e8e8e8;
	background-color: white;
	font-weight: 700;
	text-align: left; 
`;

const ListItem = styled.div`
    display: inline-block;
    overflow: hidden;
    width: 100%;
    padding: 8px 10px;
    font-size: 1.5rem;
    line-height: 1.6rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
    cursor: pointer;

    &:hover {
        background-color: #FFCC01;
        color: white;
    }

`;

const DropDown = (props) => {

    const { title } = props;

    const [listOpen, setListOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(title);
    const [searchTerm, setSearchTerm] = useState('');

    const closeRef = useRef();
    useOnClickOutside(closeRef, () => { setListOpen(false); });

    function ifItemIsSelected(item) {
        if (item.selected) {
            return true;
        } else {
            return false;
        }
    }

    function selectItem(item) {
        // deselect the previously selected item
        for(let i = 0; i < props.list.length; i++ ) {
            if(props.list[i].selected) {
                props.list[i].selected = false;
            }
        }
        
        if(typeof selectedItem === 'string') {
            setSelectedItem(item);
            setListOpen(false);
            item.selected = true;
        } else { // its a object
            setSelectedItem(item);
            setListOpen(false);
            item.selected = true;
        }
        
        if (props.function != null) {
            props.function(item);
        }
    }

    function getSelectedItemTitle() {

        let tempList = props.list;

        for(let i = 0; i < tempList.length; i++ ) {
            if(tempList[i].selected)
                return tempList[i].title;
        }
        return props.title
    }

    function filterList(e) {
        setSearchTerm(e.target.value.toLowerCase())
    }

    function listItems() {

        // I already declare this varaible above?
        const { list } = props;
       
        let tempList = list;

        if (searchTerm) {
            tempList = list.filter(function (item) {
                return item.title.toLowerCase().search(
                    searchTerm.toLowerCase()) != -1
            }).sort((a, b) => {
                if (a.title < b.title) { return -1; }
                if (a.title > b.title) { return 1; }
                return 0;
            });
        }
     
        return (
            tempList.map((item) => (
                <ListItem 
                    key={item.id}
                    onClick={() => selectItem(item)}
                >
                    {item.title} {ifItemIsSelected(item) && (<StyledFontAwesomeIcon icon={faCheck} />)}
                </ListItem>
            ))
        );
    }

    const { searchable } = props;
   
    return (
        <Container ref={closeRef}>
            <Header onClick={() => setListOpen(!listOpen)}>
                <span>{getSelectedItemTitle()}</span>
                {listOpen ? <StyledFontAwesomeIcon size="2x" icon={faAngleDown} /> : <StyledFontAwesomeIcon size="2x" icon={faAngleUp} />}
            </Header>

            <List open={listOpen}>
                {searchable && (
                        <SearchBar
                            placeholder={searchable[0]}
                            onChange={(e) => filterList(e)}
                        />
                    )
                }
                {listItems()}
            </List>
        </Container>
    );
}

export default DropDown;