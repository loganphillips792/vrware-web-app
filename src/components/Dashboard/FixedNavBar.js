import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faMicrophoneAlt, faCog, faEnvelope, faBug, faSignOutAlt  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { API_URL } from '../../constants.js';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import ReactTooltip from "react-tooltip";

const SideNav = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 40px;
    background-color: #252525;
    // on top of SearchContainer
    //z-index: 2;
`;

const IconsContainer = styled.div`
    display: flex;
    position: absolute;
    width: 100%;
    top: 100px;
    flex-direction: column;
    align-items: center;

    & > * {
        margin: 15px 0;
    }
`;

const MetricsIcon = styled(FontAwesomeIcon)`
    color: ${props => props.activatedIcon==='metrics' ? '#298EEB' : '#FFFFFF' };
    cursor: pointer;

    &:hover {
        color: #298EEB;
    }
`;

const RecordIcon = styled(FontAwesomeIcon)`
    color: ${props => props.activatedIcon==='record' ? '#298EEB' : '#FFFFFF' };
    cursor: pointer;

    &:hover {
        color: #298EEB;
    }
`;

const SettingsIcon = styled(FontAwesomeIcon)`
    color: ${props => props.activatedIcon==='settings' ? '#298EEB' : '#FFFFFF' };
    cursor: pointer;

    &:hover {
        color: #298EEB;
    }
`;

const EmailIcon = styled(FontAwesomeIcon)`
    color: ${props => props.activatedIcon==='email' ? '#298EEB' : '#FFFFFF' };
    cursor: pointer;

    &:hover {
        color: #298EEB;
    }
`;

const SignOutIconContainer = styled.div`
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    justify-content: center;
`;

const BugIcon = styled(FontAwesomeIcon)`
    color: ${props => props.activatedIcon==='bug' ? '#298EEB' : '#FFFFFF' };
    cursor: pointer;

    &:hover {
        color: #298EEB;
    }
`;

const SignOutIcon = styled(FontAwesomeIcon)`
    color: #FFFFFF;
    cursor: pointer;

    &:hover {
        color: #298EEB;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #595959;

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

const FixedNavBar = () => {
    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);

    const [activatedIcon, setActivatedIcon] = useState('metrics');

    function handleLogout(e) {
        console.log("Logging out...");
        fetch(API_URL + "logout/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            },
            credentials: 'include'
        })
        .then(response => response.text())
        .then(parsedResponse => {
            setRedirectToLoginPage(true);
        });
    }

    return (
        <SideNav>
            { redirectToLoginPage && <Redirect to={{ pathname: "/login" }} /> }
            <IconsContainer>
                <StyledLink to={{ pathname: '/dashboard/overview'}}>
                    <MetricsIcon activatedIcon={activatedIcon} icon={faChartBar} size="2x" onClick={() => setActivatedIcon('metrics')} data-tip='Metrics' data-effect='solid' />
                </StyledLink>
                <StyledLink to={{ pathname: '/dashboard/record'}}>
                    <RecordIcon activatedIcon={activatedIcon} icon={faMicrophoneAlt} size="2x" onClick={() => setActivatedIcon('record')} data-tip='Record new pitch' data-effect='solid'  />
                </StyledLink>
                <StyledLink to={{ pathname: '/settings'}}>
                    <SettingsIcon activatedIcon={activatedIcon} icon={faCog} size="2x" onClick={() => setActivatedIcon('settings')} data-tip='Account settings' data-effect='solid' />
                </StyledLink>
                <StyledLink to={{ pathname: '/email'}}>
                    <EmailIcon activatedIcon={activatedIcon} icon={faEnvelope} size="2x" onClick={() => setActivatedIcon('email')} data-tip='Email' data-effect='solid' />
                </StyledLink>
            </IconsContainer>
            {/* <StyledLink to={{ pathname: '/changes'}}>
                <BugIcon activatedIcon={activatedIcon} icon={faBug} size="2x" onClick={() => setActivatedIcon('bug')} />
            </StyledLink> */}
            <SignOutIconContainer>
                <SignOutIcon activatedIcon={activatedIcon} icon={faSignOutAlt} size="2x" onClick={() => setActivatedIcon('')} onClick={handleLogout}/>
            </SignOutIconContainer>
            <ReactTooltip />
        </SideNav>
    );

}

export default FixedNavBar;

