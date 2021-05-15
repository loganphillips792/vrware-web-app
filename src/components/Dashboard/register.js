import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Input from '@material-ui/core/Input';
import { API_URL } from '../../constants.js';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';

const Container = styled.div`
    h1 {
        text-align: center;
		color: #4d4d4d;
		font-size: 24px;
		padding: 20px 0 20px 0;
	}
	
	p {
		text-align: center;
	}
`;

const StyledRegisterForm = styled.form`
    width: 300px;
	margin: 0 auto;
	padding-bottom: 75px;
`;

const StyledInput = styled(Input)`
    margin-bottom: 15px;
    width: 100%;
`;

const StyledRadio = styled(Input)`
`;

const SubmitButton = styled.div`

	padding: 12px 20px;
	border: none;
	border-radius: 20px;
	text-align: center;

	${function(props) {
		if(props.disabled) {
			return css`
			background-color: #cccccc;
			color: white;
			cursor: not-allowed;
			`
		} else {
			return css`
				background-color: #4CAF50;
				color: white;
				cursor: pointer;
			`
		}
	}}
	
`

const RegisterForm = (props) => {

	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [email, setEmail] = useState('');
	const [accountType, setAccountType] = useState('individual');
    const [classCode, setClassCode] = useState('');

    const [redirectToProfile, setRedirectToProfile] = useState(false);


	let handleUserNameInputChange = (e) => {
		setUserName(e.target.value);
	}

	let handlePasswordInputChange = (e) => {
		setPassword(e.target.value);
	}

	let handlePasswordRepeatInputChange = (e) => {
		setRepeatPassword(e.target.value);
	}

	let handleEmailInputChange = function(e) {
		setEmail(e.target.value);
	}

	let handleAccountTypeInputChange = function(e) {
		setAccountType(e.target.value);
        console.log(e.target.value);

        if(e.target.value == "individual") {
            setClassCode("");
        }
	}

    let handleRegister = (e) => {
		fetch(API_URL+"register/", {
			method: 'POST',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({userName: userName, password: password, firstName, lastName: lastName, email: email}), 
			'credentials':'include' // NEED THIS OR csrftoken and sessionid cookie ARE NOT RETURNED
		})
		.then(response => response.json())
		.then(response => {
			setRedirectToProfile(true);
		});

	}

	const handleSuccessResponseGoogle = (response) => {
        console.log("Registering with Google successful", response);
    }

    const handleFailResponseGoogle = (response) => {
        console.log("Registering with Google failed", response);
    }

	// if (password === repeatPassword) {
	// 	setPasswordsMatch(true);
	// } else {
	// 	setPasswordsMatch(false);
	// }
	
	// let submitButton;

	// if (passwordsMatch) {
	// 	submitButton = <SubmitButton onClick={handleRegister}>Submit</SubmitButton>
	// } else {
	// 	submitButton = <SubmitButton onClick={handleRegister} disabled>Submit</SubmitButton>
	// }

	let submitButton = (password === repeatPassword) && (password && repeatPassword) && (userName) && (email) && ((accountType == "individual") || ((accountType == "group") && (classCode)))
		? <SubmitButton onClick={handleRegister}>Submit</SubmitButton>
		: <SubmitButton onClick={handleRegister} disabled>Submit</SubmitButton>

	let classCodeField = (accountType == "group")
		? <StyledInput type="text" placeholder="Class code" required onChange={(e) => setClassCode(e.target.value)} inputProps={{ style: { fontSize: 30 } }} />
		: <div><br /><br /></div>

    return (
        <Container>
            {redirectToProfile && <Redirect to={{ pathname: "/dashboard/overview" }} /> }
            <StyledRegisterForm>
				<h1>Register</h1>
				<p>Please create an account</p>
				{/* <input type="text" placeholder="Username" required onChange={handleUserNameInputChange} /> */}
				{/* <input type="password" placeholder="Password" required onChange={handlePasswordInputChange} /> */}
				{/* <input type="text" placeholder="Email" required onChange={handleEmailInputChange} /> */}

				<StyledInput type="text" placeholder="Username" value={userName} required onChange={(e) => setUserName(e.target.value)} inputProps={{ style: { fontSize: 30 } }} />
				<StyledInput type="text" placeholder="First name" value={firstName} required onChange={(e) => setFirstName(e.target.value)} inputProps={{ style: { fontSize: 30 } }} />
                <StyledInput type="text" placeholder="Last name" value={lastName} required onChange={(e) => setLastName(e.target.value)} inputProps={{ style: { fontSize: 30 } }} />
				<StyledInput type="text" placeholder="Email" required onChange={(e) => setEmail(e.target.value) } inputProps={{ style: { fontSize: 30 } }} />
				<StyledInput type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} inputProps={{ style: { fontSize: 30 } }} />
				<StyledInput type="password" placeholder="Confirm Password" required onChange={(e) => setRepeatPassword(e.target.value) } inputProps={{ style: { fontSize: 30 } }} />
				<h1>Register as:</h1>
                <div>
                    <div style={{float: "left"}}>
                        <input type="radio" id="individual" name="accountType" value="individual" onClick={(e) => handleAccountTypeInputChange(e)} inputProps={{ style: { fontSize: 30 } }}/> Individual
                    </div>
                    <div style={{float: "right"}}>
                        <input type="radio" id="group" name="accountType" value="group" onClick={(e) => handleAccountTypeInputChange(e)} inputProps={{ style: { fontSize: 30 } }}/> Group member
                    </div>
                </div>
                { classCodeField }
				{ submitButton }
				<GoogleLogin clientId="804867060664-8p1k8rudvms4ph1tip7vflqev5g3ukt1.apps.googleusercontent.com" buttonText="Login" onSuccess={handleSuccessResponseGoogle} onFail={handleFailResponseGoogle} cookiePolicy={'single_host_origin'} />
            </StyledRegisterForm>
        </Container>
    );
}

export default RegisterForm;
