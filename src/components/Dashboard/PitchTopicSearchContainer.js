import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import Input from '@material-ui/core/Input';
import { useStoreActions, useStoreState } from 'easy-peasy';

const StyledSearchContainer = styled.div`
    position: fixed;
    height: 100%;
    //position: relative;
    //background-color: #fafafa;
    background-image: linear-gradient( to right, #81d1ee, #7db7db );
    width: ${({collapse}) => collapse ? '0' : '240px'};
    //border-right: 3px solid #dde3e3;
    border-right: 3px solid #000000;
    transition: 0.5s;
    top: 0;
    left: 0;
    bottom: 0;
    margin-left: 40px;
    padding: ${({collapse}) => collapse ? '10px 0 10px 0' : '10px'};
    overflow-x: hidden;
`;

const StyledInput = styled(Input)`
    font-family: "Open Sans", sans-serif;
	margin-top: 10px;

    margin-bottom: 15px;
    width: 100%;
    
    &::placeholder {
		text-align: center;
	}
`;

const SearchResultItem = styled.div`
    font-family: "Open Sans", sans-serif;
	font-weight: 650;
	font-size: 18px;
    position: relative;
    width: 100%;
    height: 45px;
    //color: ${(props) => props.itemID === props.selectedPitchTopicID ? '#dde2e3' : '#000000' };
    //background-color: ${(props) => props.itemID === props.selectedPitchTopicID ? '#4d5862' : '#FBF9F9' };
    color: ${(props) => props.itemID === props.selectedPitchTopicID ? '#000000' : '#000000' };
    background-color: ${(props) => props.itemID === props.selectedPitchTopicID ? 'rgb(255, 255, 255, 0.6)' : 'rgb(255, 255, 255, 0.3)' };
	border-radius: 5px;
    margin-bottom: 10px;
    padding: 10px;
    cursor: pointer;

    &:hover {
        //background-color:  ${(props) => props.itemID != props.selectedPitchTopicID && '#e9ecee' };
        background-color:  ${(props) => props.itemID != props.selectedPitchTopicID && 'rgb(255, 255, 255, 0.6)' };
    }

    .number_of_pitches {
        position: absolute;
        //right: 0;
        right: 5%;
		font-size: 13px;
        bottom: 0;
    }
`;

const ExpandCollapseIconContainer = styled.div`
	position: fixed;
	padding: 5px 7px 5px 7px;
	top: 3%;
    left: calc(2% + ${props => props.currentWidthOfSearchContainer});
    transition: 0.5s;
	background-color: rgb(0, 0, 0, 0.1);
	border-radius: 5px;
    z-index: 2;
    cursor: pointer;
`;

const ExpandSearchContainerIcon = styled(FontAwesomeIcon)``;

const CollapseSearchContainerIcon = styled(FontAwesomeIcon)``;

const PitchTopicSearchContainer = (props) => {
    const [searchContainerCollapse, setSearchContainerCollapse] = useState(false);
    const [currentlySelectedPitchTopic, setCurrentlySelectedPitchTopic] = useState(-1);
    const data = useStoreState(state => state.pitchTopics.pitches);

    const searchEl = useRef(null);

    function filterResults(e) {
        // let updatedList = null;

        // //Filter by search
        // updatedList = data.filter(function(item) {
        //     console.log("ITEM", item.name)
        //     return item.name.toLowerCase().search(
        //         searchEl.current.value.toLowerCase()) != -1
        // });
    }

    const selectPitchTopic = useStoreActions(actions => actions.selectedPitchTopic.setPitchTopic)

    function handleSearchResultsItemClick(item) {
       setCurrentlySelectedPitchTopic(item.id);
       selectPitchTopic(item);
    }
    

    const handleToggleSearchContainer = () => {
        setSearchContainerCollapse(!searchContainerCollapse);
        // need to add 40px to both values because of the fixed side nav
        if (searchContainerCollapse) {
            props.setCurrentWidthOfSearchContainerFromChild('280px');
        } else {
            props.setCurrentWidthOfSearchContainerFromChild('40px');
        }
    }

    let icon = null;
    if(searchContainerCollapse) {
        icon = <ExpandSearchContainerIcon icon={faAngleDoubleRight} size="3x" onClick={handleToggleSearchContainer} />;
    } else {
        icon = <CollapseSearchContainerIcon icon={faAngleDoubleLeft} size="3x" onClick={handleToggleSearchContainer} />;
    }

    return (
        <StyledSearchContainer collapse={searchContainerCollapse}>
            <ExpandCollapseIconContainer currentWidthOfSearchContainer={props.currentWidthOfSearchContainer}>
                {icon}
            </ExpandCollapseIconContainer>
            
            <StyledInput ref={searchEl} type="text" placeholder="Search..." onChange={filterResults} inputProps={{ style: { fontSize: 22, textAlign: "center", fontFamily: "'Open Sans'" } }} />
            <div>
                {
                    data.map((item, index) => (
                        <SearchResultItem key={index} itemID={item.id} selectedPitchTopicID={currentlySelectedPitchTopic} onClick={() => handleSearchResultsItemClick(item)}>
                            <span>{item.name}</span>
                            <span class="number_of_pitches">{item.audio_files.length} pitches</span>
                        </SearchResultItem>
                    ))
                }
            </div>
        </StyledSearchContainer>
    )
}

export default PitchTopicSearchContainer;

