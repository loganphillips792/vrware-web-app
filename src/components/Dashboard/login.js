import React, { useState } from 'react';
import styled from 'styled-components';
import { API_URL } from '../../constants.js';
import { Redirect } from 'react-router-dom';
import Input from '@material-ui/core/Input';
import { useToasts } from 'react-toast-notifications';
import GoogleLogin from 'react-google-login';

const Container = styled.div`
   
    h1 {
        text-align: center;
        color: #4d4d4d;
        font-size: 24px;
        padding: 20px 0 20px 0;
    }

    .login_failure_box {
        border: 2px solid red;
    }
`;

const StyledLoginForm = styled.form`
    width: 300px; 
    // center form in side LoginRegister.js
    margin: 0 auto;
    //position: relative;
    //top: 50%;
    padding-bottom: 75px;
`;

const StyledInput = styled(Input)`
    margin-bottom: 15px;
    width: 100%;
`;

const SubmitButton = styled.div`
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 20px;
    text-align: center;
    cursor: pointer;
`;

const LoginForm = (props) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);
    const { addToast } = useToasts();

    let handleUserNameInputChange = (e) => {
        setUserName(e.target.value);
    }

    let handlePasswordInputChange = (e) => {
        setPassword(e.target.value);
    }

    function handleLogin(e) {

        fetch(API_URL+"login/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: userName, password: password}),
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 401) {
                setRedirectToDashboard(false);
                addToast('Login failed. Please Enter correct username and password', { appearance: 'error', autoDismiss: true}); 
              } else if (response.status === 200) {
                setRedirectToDashboard(true);
              } else {
                setRedirectToDashboard(false);
              }
              return response.json();
        })
        .then(parsedResponse => {});
    }

    const handleSuccessResponseGoogle = (response) => {
        console.log("Logging in with Google successful", response);
        // Send token to backend
        fetch(API_URL + `api/social/google-oauth2/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ code: response.accessToken }),
        }).then(response => {
            if(response.status === 201) {
                //addToast('Note successfully created', { appearance: 'success', autoDismiss: true});
                return response.json();
            }
        }).then(parsedResponse => {
            // redirect to dashboard on successful Google login
            setRedirectToDashboard(true);
        }).catch(error => console.log(error));

    }

    const handleFailResponseGoogle = (response) => {
        console.log("Logging in with Google failed", response);
    }

    return (
        <Container>
            {redirectToDashboard && <Redirect to={{ pathname: "/dashboard/overview" }} /> }
            <StyledLoginForm>
                <h1>Login</h1>
                <StyledInput type="text" placeholder="Username" value={userName} required onChange={handleUserNameInputChange} inputProps={{ style: { fontSize: 30 } }} />
                <StyledInput type="password" placeholder="Password" required onChange={handlePasswordInputChange} inputProps={{ style: { fontSize: 30 } }} />
                <GoogleLogin
                    clientId="804867060664-8p1k8rudvms4ph1tip7vflqev5g3ukt1.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={handleSuccessResponseGoogle}
                    onFail={handleFailResponseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
                <SubmitButton onClick={handleLogin}>Submit</SubmitButton>
            </StyledLoginForm>
        </Container>
    )
}

export default LoginForm;