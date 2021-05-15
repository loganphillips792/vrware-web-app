import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { API_URL } from '../../../constants.js';
import { Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Input, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import useOnClickOutside from '../../shared_components/hooks/useOnClickOutside.js';
import { useElements, Elements, CardElement, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStoreState } from 'easy-peasy';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../shared_components/Modal.js';
import { Radio } from 'antd';
import { useToasts } from 'react-toast-notifications';

const Container = styled.div`
    height: 100vh;
    
    .center {
        text-align: center;
    }
`;

const DeleteAccountRow = styled.div`
    display: flex;
    border: 1px solid #d73a49;
    border-radius: 6px;
`;

const DeleteAccountButton = styled.div`
    background-color: #fafbfc;
    color: #cb2431;
    padding: 5px 16px 5px 16px; 
    // put flex item to end of the row
    margin-left: auto;
    margin-right: 10px;
    align-self: center;
    border: 1px solid #d9dbdb
    border-radius: 6px;

    &:hover {
        color: #fff;
        background-color: #cb2431;
        cursor: pointer;
    }
`;

const AudioSettingsPage = () => {
    document.body.style.backgroundColor = '#fafafa';

    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const user = useStoreState(state => state.user);
    const userProfile = useStoreState(state => state.user);

    /*
    // const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(API_URL + "api/profiles/logged_in", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(parsedResponse => {
                setUser(parsedResponse.user);
                setIsLoading(false);
            });
    }, [])

    */

    const handleDeleteUserAccount = () => {

        fetch(API_URL + "api/users/" + user.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': Cookie.get('csrftoken')
            },
            credentials: 'include'
        })
            .then(response => {
                if (response.status === 204) {
                    setRedirectToLoginPage(true);
                } else if (response.status === 404) {

                }
            });
    }
 
    if(Object.keys(userProfile.userProfile).length === 0 && userProfile.userProfile.constructor === Object) {
        return null;
    } 

    return (
        <Container>
            {redirectToLoginPage && <Redirect to={{ pathname: "/login" }} />}
            {/* <Banner /> */}
            <h1 class="center">User Settings</h1>
            {/* <span>{JSON.stringify(user)}</span> */}

            <div>
                <h1>Subscription</h1>
                <SubscriptionContainer />
            </div>
            

            <DeleteAccountRow>
                <div>
                    <b>Delete this account</b>
                    <p>Once the account is deleted, you will not be able to retrieve the data</p>
                </div>
                <DeleteAccountButton onClick={() => setShowConfirmationModal(true)}>Delete my account</DeleteAccountButton>
            </DeleteAccountRow>
            <DeleteConfirmationModal visible={showConfirmationModal} user={userProfile.userProfile.user} closeModalFromChild={() => setShowConfirmationModal(false)} deleteUserAccountFromChild={() => handleDeleteUserAccount()} />
        </Container>  
    );
}

const GrayOutViewPort = styled.div`
    display: ${({ visible }) => visible ? 'block' : 'none'};
    opacity: 0.7; 
    background: #000; 
    width: 100%;
    height: 100%; 
    top: 0; 
    left: 0; 
    position: fixed; 
    z-index: 2;
`;

const StyledDeleteConfirmationModal = styled.div`
    display: ${({visible}) => visible ? 'block': 'none'};
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 80vh;
    overflow-y: auto;
    //padding:20px;
    margin-top:20px;
    background-color:rgba(255,255,255);
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    border-radius:3px;
    -webkit-box-shadow: 0px 0px 2px #888888;
    -moz-box-shadow: 0px 0px 2px #888888;
    box-shadow: 0px 0px 2px #888888;
    // on top of <GrayOutViewPort />
    z-index: 3;
`;

const Header = styled.div`
    // to position CloseIcon
    position: relative;
    color: #24292e;
    background-color: #f6f8fa;
    padding: 16px;
`;

const Body = styled.div`
    padding: 15px;
`;

const CloseIcon = styled(FontAwesomeIcon)`
    position: absolute;
    right: 2px;
    cursor: pointer;

    &:hover {
        color: #0366d6;
    }
`;

const ConfirmDeleteInput = styled(Input)``;

const ConfirmDeleteButton = styled.div`
    border: 1px solid #1b1f2326;
    border-radius: 6px;
    cursor: pointer;
    padding: 5px 16px;
    margin-top: 10px;

    ${props => {
        if (props.activate) {
            return `
                color: #fff;
                background-color: #cb2431;
            `
        } else {
            return `
                color: #cb243180;
                background-color: #fafbfc;
                pointer-events: none;
            `
        }
    }}
`;

const DeleteConfirmationModal = ({visible, user, closeModalFromChild, deleteUserAccountFromChild}) => {

    const [deleteConfirmationInputValue, setDeleteConfirmationInputValue] = useState('');
    let activateButton = false;

    const closeRef = useRef();
    useOnClickOutside(closeRef, () => { closeModalFromChild(); });

    if (deleteConfirmationInputValue === user.username+'/DeleteAccount') {
        activateButton = true;
    }

    return (
        <div>
            <GrayOutViewPort visible={visible} />
            <StyledDeleteConfirmationModal visible={visible} ref={closeRef}>
                <Header>Are you absolutely sure?<CloseIcon icon={faTimes} size="2x" onClick={() => closeModalFromChild()} /></Header>
                <Body>
                    This action <b>cannot</b> be undone. This will permanently delete the account of {user.username}.<br />
                    Anyone will be free to use your username.
                    <br />
                    Please type <b>{user.username}/DeleteAccount</b> to confirm.
                    <ConfirmDeleteInput type="text" name="confirmdelete"  value={deleteConfirmationInputValue} required onChange={(e) => setDeleteConfirmationInputValue(e.target.value)} />
                    <ConfirmDeleteButton activate={activateButton} onClick={deleteUserAccountFromChild}>Delete my account</ConfirmDeleteButton>
                </Body>
            </StyledDeleteConfirmationModal>
        </div>
    )
}

const StyledSubscriptionContainer = styled.div`
    // so we can position <EditSubscriptionButton /> relative to this
    position: relative;
    width: 250px;
    height: 250px;
    border-radius: 10px;
    border: 1px solid #dde2e3;
    background-color: #ffffff;

    span {
        font-family: 'Open Sans';
        font-weight: 700;
    }

    .search-row {
        display: flex;
        align-items: center;
    }

`;

// https://fdossena.com/?p=html5cool/buttons/i.frag
const EditSubscriptionButton = styled.div`
    position: absolute;
    bottom: 0;
    padding:0.35em 1.2em;
    border:0.1em solid #c5bfa9;;
    margin:0 0.3em 0.3em 0;
    border-radius:0.12em;
    text-decoration:none;
    font-family:'Roboto',sans-serif;
    font-weight:300;
    text-align:center;
    transition: all 0.2s;
    color: #000000;
    cursor: pointer;

    &:hover {
        background-color: #c5bfa9;;
    }
`;

const PayButton = styled.div`
    padding:0.35em 1.2em;
    border:0.1em solid #c5bfa9;;
    margin:20px 0.3em 0.3em 0;
    border-radius:0.12em;
    text-decoration:none;
    font-family:'Roboto',sans-serif;
    font-weight:300;
    text-align:center;
    transition: all 0.2s;
    color: #000000;
    cursor: pointer;
   

    &:hover {
        background-color: #c5bfa9;;
    }

    ${props => {
        if (props.activate) {
            return `
                color: #fff;
                background-color: #cb2431;
            `
        } else {
            return `
                color: #cb243180;
                background-color: #fafbfc;
                pointer-events: none;
            `
        }
    }}

`;

const RadioButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const SearchIcon = styled(FontAwesomeIcon)`
`;

const stripePromise = loadStripe('pk_test_51HBr7VFTzQiqEKMx7yIF1Gg97wqnIDwPmHudd8B7fck03XFhqo2cJfZdxMavchsMalD4lrCFSZmkYGi0i1zjI39900YOZHCBau');

const SubscriptionContainer = () => {
    const userProfile = useStoreState(state => state.user);

    const [showEditSubscriptionModal, setShowEditSubscriptionModal] = useState(false);
    const [radioButtonValue, setRadioButtonValue] = useState('group');
    const [searchValue, setSearchValue] = useState('LAUNCH2020');
    const [codeSearchResult, setCodeSearchResult] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [activateButton, setActivateButton] = useState(false);

    const { addToast } = useToasts();
    

    const handleSearchClick = () => {


        let headers = new Headers();
        //headers.append('X-CSRFToken', Cookie.get('csrftoken'));
        headers.append('Accept', 'application/json')

        let requestOptions = {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        }

        fetch(API_URL+`api/subscriptions/code/${searchValue}`, requestOptions)
            .then(response => {
                response.json().then(jsonResponse => {
                    if(response.status === 200) {
                        setCodeSearchResult(jsonResponse)
                    } else if(response.status === 404) {
                        addToast('Cohort Code not found', { appearance: 'error', autoDismiss: true});
                    } 

                    if(response.status != 200) {
                        setCodeSearchResult(null);
                    }
                    // if (response.status === 202) {
                        // addToast('1 file successfully uploaded', { appearance: 'success', autoDismiss: true});
                    //     setRedirectToProfile(true);
                    // } else if(response.status === 409) {
                    //     props.showSpinnerOnAudioRecordingPage(false);
                    //     addToast(jsonResponse['msg'], { appearance: 'error', autoDismiss: true});
                    // }
                })
            })
        }

    // so we don't get TypeError: Cannot read property 'expiration_date' of undefined
    // if(userProfile.userProfile.user.subscription_code === undefined) {
    //     return null;
    // }

    if(Object.keys(userProfile.userProfile).length === 0 && userProfile.userProfile.constructor === Object) {
        return null;
    } 

    return (
        <StyledSubscriptionContainer>
            <h4>Your Plan</h4>
            <div>{userProfile.userProfile.user.subscription_code !== null ? userProfile.userProfile.user.subscription_code.code : 'FREE'}</div>
            {userProfile.userProfile.user.subscription_code !== null &&
                <div>Next payment due: {userProfile.userProfile.user.expiration_date}</div>
            }
            <EditSubscriptionButton onClick={() => setShowEditSubscriptionModal(true)}>
                EDIT SUBSCRIPTION
            </EditSubscriptionButton>

            <Modal show={showEditSubscriptionModal} closeModalFromChild={() => setShowEditSubscriptionModal(false)}>
                <ModalHeader>Edit Subscription</ModalHeader>

                <ModalBody>
                    <p>Edit Subscription</p>
                    <RadioButtonsContainer>
                        <Radio.Group value={radioButtonValue} onChange={(e) => setRadioButtonValue(e.target.value) }>
                            <Radio value={'group'}>I am part of a cohort</Radio>
                            <Radio value={'individual'}>I am an individual</Radio>
                        </Radio.Group>
                    </RadioButtonsContainer>

                    {radioButtonValue === 'group' ?
                        <div>
                            <div class="search-row">
                                <Input placeholder="Enter cohort code" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                                <SearchIcon icon={faSearch} onClick={handleSearchClick} />
                            </div>
                            {codeSearchResult != null ? <Checkbox onChange={(e) => { if(e.target.checked) setActivateButton(true); else setActivateButton(false); } }>{codeSearchResult.code}</Checkbox> : <p>No results found</p>}
                            <PayButton role="link" activate={activateButton} onClick={() => { setShowEditSubscriptionModal(false); setShowPaymentModal(true); } }>
                               JOIN COHORT
                            </PayButton>
                            
                        </div>
                        :
                        <div>
                            <span>An individual account is $15 a month</span>
                        </div>
                    }
                </ModalBody>

                <ModalFooter>
                    
                </ModalFooter>
            </Modal>

            <GrayOutViewPort visible={showPaymentModal} />
            {/* So we don't get TypeError: Cannot read property 'payment_amount' of null */}
           {codeSearchResult != null &&
            <Elements stripe={stripePromise}>
                <PaymentModal show={showPaymentModal} paymentInfo={codeSearchResult} closeModalFromChild={() => setShowPaymentModal(false) } />
            </Elements> 
           }
            
        </StyledSubscriptionContainer>
    )
}

const StyledPaymentModal = styled.div`
    position: fixed;
    
    display: ${(props) => props.show ? 'block' : 'none'};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  
    border-radius: 5px;
    width: 500px;
    z-index: 2;

    background-color: #ffffff;
    border-radius: 3px; 
    width: 340px;
    height: 250px;
    
`;

const PaymentCloseIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: 0;
    right: 2px;
    cursor: pointer;

    &:hover {
        color: #0366d6;
    }
`;

const PaymentForm = styled.form`
    z-index: 3;
    .sr-input {
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 6px;
        padding: 5px 12px;
        height: 44px;
        width: 100%;
        transition: box-shadow 0.2s ease;
        background: white;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
    }
`;

const PaymentButton = styled.div`
    cursor: pointer;
    border: 0;
    width: 100%;
    text-align: center;
    height: 40px;
    box-shadow: inset 0 0 0 1px rgba(50, 50, 93, 0.1),
    0 2px 5px 0 rgba(50, 50, 93, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.07);
    border-radius: 6px 6px 6px 6px;
    font-size: 16px;
    font-weight: 600;

    background-color: rgb(0, 116, 212);
    color: rgb(255, 255, 255);
`;

const PaymentModal = (props) => {
    const stripe = useStripe();
    const elements = useElements();

    const [paymentIsProcessing, setPaymentIsProcessing] = useState(false);

    const renderForm = () => {
        const options = {
            style: {
              base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
              },
            },
          };


    const handlePaymentClick = async (e) => {
        //setPaymentIsProcessing(true);
        return fetch(API_URL + "api/create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            //body: JSON.stringify(content)
          })
            .then(function(response) {
              return response.json();
            })
            .then(function(responseJSON) {
                let clientSecret = responseJSON.client_secret;
                // Initiate payment when the submit button is clicked
                pay(clientSecret);
                //setPaymentIsProcessing(false);
                //return paymentIntent;
            });
    }

    const pay = (clientSecret) => {
        console.log(elements.getElement(CardElement));
        const result = stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        }) 
        .then(function(result) {
            if(result.error) {
                console.log("PAYMENT ERROR", result.error.messages);
            } else if (result.paymentIntent.status === 'succeeded') {
                alert('Payment successful!')
            } 
        })

        
    }


        return (
            <PaymentForm>
                <div>
                    Payment amount: {props.paymentInfo.payment_amount}
                </div>
                {/* <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    autoComplete="cardholder"
                    className="sr-input"
                /> */}
                <div>
                    <CardElement
                        className="sr-input sr-card-element"
                        options={options}
                    />
                </div>
                <PaymentButton onClick={handlePaymentClick}>Pay ${props.paymentInfo.payment_amount}</PaymentButton>
            </PaymentForm>
        )
    }

    return (
        <StyledPaymentModal show={props.show}>
            {paymentIsProcessing 
                ?
                <div>processing your payment...</div>
                :
                <div>
                    <p>Join Cohort</p>
                    <PaymentCloseIcon icon={faTimes} size="2x" onClick={() => props.closeModalFromChild()} />
                    {renderForm()}
                </div>
            }
        </StyledPaymentModal>
    );
}

export default AudioSettingsPage;