import React, { useState } from 'react';
import { API_URL } from '../../constants.js';
import styled, { createGlobalStyle } from 'styled-components';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import Lottie from 'react-lottie';
import SuccessfulEmailVerificationAnimationData from './email-verify-success.json';
import FailedEmailVerificationAnimationData from './email-verify-fail.json';
import { Button, Heading } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom';

const Container = styled.div`
`;

const EmailVerification = () => {
    let { token_slug } = useParams();
    const [valid, setValid] = useState(0);

    if(token_slug) {
        fetch(API_URL+"users/validate-email-token", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookie.get('csrftoken')
            },
            body: JSON.stringify({ 'token': token_slug }), 
            'credentials': 'include'
        })
        .then(res => res.json())
        .then(response => {
            if(response.status === 'success') {
                setValid(1);
            } else if(response.status === 'failed') {
                setValid(2);
            }
        })
    }

    return (
        <Container>
            {valid == 1 && <SuccesfulVerification />}
            {valid == 2 && <FailedVerification />}
        </Container>
    )
}

const SuccessfulVerificationContainer = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SuccesfulVerification = () => {
    const history = useHistory();

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: SuccessfulEmailVerificationAnimationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };

    return (
        <SuccessfulVerificationContainer>
            <Lottie options={defaultOptions}
              height={400}
              width={400}
            />
            {/* <Heading as="h1" size="lg">Email Verification successful</Heading> */}
            <span>Your email address was successfully verified.</span>
            {/* <Button colorScheme="blue" onClick={() => history.push("/login")}>Login</Button> */}
        </SuccessfulVerificationContainer>
    )
}

const FailedVerificationContainer = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const FailedVerification = () => {
    const history = useHistory();

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: FailedEmailVerificationAnimationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };

    return (
        <FailedVerificationContainer>
            <Lottie options={defaultOptions}
              height={400}
              width={400}
            />
            <Heading as="h1" size="4xl">Email Verification failed</Heading>
            <span>There was an issue verifying your email.</span>
        </FailedVerificationContainer>
    )
}
export default EmailVerification;

