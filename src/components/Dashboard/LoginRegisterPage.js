import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import LoginForm from './login.js';
import RegisterForm from './register.js';
import { API_URL } from '../../constants.js';
import Cookie from 'js-cookie';
// import companyLogo from '../authentication/vrware_logo.PNG';


const Container = styled.div`
    height: 100vh;
    background-color: #f2f2f2;
   
    h1 {
        text-align: center;
		color: #4d4d4d;
		font-size: 24px;
		padding: 20px 0 20px 0;
    }
`;

const Skew = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    //background: #2c3e50;
    background-image: -webkit-linear-gradient(to left, #7db0db, #ff9922);
    background-image: linear-gradient(to right, #7db0db, #ff9922);
    z-index: 0;
    transform: skewY(30deg);
    transform-origin: top right;
`;

const LoginRegisterBox = styled.div`
    background-color: #ffffff;
    // https://codepen.io/sdthornton/pen/wBZdXq
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    // will position relative to <html>
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    border-radius: 20px;
    padding-top: 30px;
`;

const Tabs = styled.div`
    display: flex;
    justify-content: space-between;
    width: 30%;
    // So <TabUnderLine /> is positioned relative> to <Tabs>
    position: relative
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    //border: 2px solid blue;
    max-width: 600px;
`;

const TabUnderLine = styled.div`
    position: absolute;
    bottom: 0;
    left: ${props => {
        if(props.current_type === 'LogIn') {
            return 0;
        } else if (props.current_type === 'register') {
            return '50%';
        }
    }};
    width: 50%;
    height: 2px;
    background-color: #4A66F4;
    -webkit-transition: left .25s;
    transition: left .25s;
`;

const LoginTab = styled.div`
    //border-bottom: ${props => props.current_type === 'LogIn' ? '5px solid red' : 'none' };
    //transition: color 0.3s;
    flex-basis: 50%;
    text-align: center;
`;

const RegisterTab = styled.div`
    //border-bottom: ${props => props.current_type === 'register' ? '5px solid red' : 'none' };
    //transition: color 2s;
    flex-basis: 50%;
    text-align: center;
`;

// const CompanyLogo = styled.div`
//     border: 2px solid blue;'
//     height: 1500px;
//     //background-image: url(${companyLogo});
// `;

const LoginRegister = (props) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [form, setForm] = useState("LogIn");
    const [isLoading, setIsLoading] = useState(true);    

    useEffect(() => {
    
        // token is only ever set when user successfully logins in 
        let token = Cookie.get('csrftoken');
    
        if (token) {
        
            fetch(API_URL + 'verifysession/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookie.get('csrftoken')
                },
                'credentials': 'include'
            })
                .then(response => {
                    setIsLoading(false);
                    if (response.status === 401) {
                        setIsAuthenticated(false);
                    } else if (response.status === 200) {
                        setIsAuthenticated(true)
                    } else {
                        setIsAuthenticated(false);
                    }
                    return response.json();
                })
                .then(response => {
                    
                }).catch(error => console.log("ERROR", error));

        } else {
            setIsAuthenticated(false);
            setIsLoading(false);
        }

    }, [isAuthenticated]);

    let formToShow;
    if (form === 'register') {
        formToShow = <RegisterForm />
    } else if(form === 'LogIn') {
        formToShow = <LoginForm />
    }

    if(isLoading) {
        return null;
    } else if(isAuthenticated) {
        window.location.href='/dashboard/overview';
    } else {
        return (
            <Container>
                <Skew />
                {/* <CompanyLogo /> */}
                <LoginRegisterBox>
                    <Tabs>
                        <LoginTab current_type={form} onClick={() => setForm("LogIn")}>Log in</LoginTab>
                        <RegisterTab current_type={form} onClick={() => setForm("register")}>Register</RegisterTab>
                        <TabUnderLine current_type={form} />
                    </Tabs>
                
                    {formToShow}
                </LoginRegisterBox>
            </Container>
        );
    }
}

export default LoginRegister;