// https://css-tricks.com/hamburger-menu-with-a-side-of-react-hooks-and-styled-components/

import React, { useState, useEffect, useContext, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../constants.js';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../shared_components/Context.js';
import { Link } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #EFFFFA;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
    height: 100vh;
    text-align: left;
    padding: 5%;
    position: fixed;
    top: 0;
    left: 0;
    transition: transform 0.3s ease-in-out;
    // want this above all other elements, including <GrayOutViewPort /> (profile.js)
    z-index: 3;

    a {
        font-size: 2rem;
        text-transform: uppercase;
        padding: 2rem 0;
        font-weight: bold;
        letter-spacing: 0.5rem;
        color: #ODOC1D;
        text-decoration: none;
        transition: color 0.3s linear;

        &:hover {
            color: #343078;
        }
    }
    
`;

const SignOutContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const SignOutButton = styled(FontAwesomeIcon)`
    cursor: pointer;
    font-size: 35px;
`;


const Menu = ({ open }) => {

    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);
    const user = useContext(UserContext);

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

    // have toast appear on login page at bottom that says 'You have successfully logged out. Pass 'showLogoutToast' as prop in <Redirect /> to conditionally render on login page
    return (
        <Container open={open}>
            { redirectToLoginPage && <Redirect to={{ pathname: "/login" }} /> }
            <h1>Welcome, {user.username}</h1>
           
            <a href="/">
                <span>Home</span>
            </a>
            <Link to={{pathname: `/profile/`}}>Profile</Link>
            <Link to={{pathname: `/profile/settings/`}}>Settings</Link>
            <Link to={{pathname: `/contact`}}>Contact</Link>
          
            <SignOutContainer class="sign-out-container">
                <SignOutButton icon={faSignOutAlt} onClick={handleLogout}/>
                <label>Logout</label>
            </SignOutContainer>
        </Container>
    );
}

export default Menu;