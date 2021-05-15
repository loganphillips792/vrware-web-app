import React, { useState, useEffect, Component } from 'react';
import ReactDOM from 'react-dom';
import Home from "./components/Home/home.js";
import Contact from "./components/Home/contact.js";
import LoginRegister from "./components/Dashboard/LoginRegisterPage.js";
import { API_URL } from './constants.js';
import styled, { createGlobalStyle } from 'styled-components';
import Cookie from 'js-cookie';
import TryItOutPage from './components/Home/TryItOutPage.js';
import AudioRecording from './components/Dashboard/Record/AudioRecordingPage.js';
import AccountSettingsPage from './components/Dashboard/Settings/AccountSettingsPage.js';
import { ToastProvider } from 'react-toast-notifications';
import Overview from './components/Dashboard/Overview/Overview.js';
import Speech from './components/Dashboard/Speech/Speech.js';
import Movement from './components/Dashboard/Movement/Movement.js';
import FixedNavBar from './components/Dashboard/FixedNavBar.js';
import HorizontalNavBar from './components/Dashboard/HorizontalNavBar.js';
import PitchTopicSearchContainer from './components/Dashboard/PitchTopicSearchContainer.js';
import Dog from './components/Dashboard/dog-removebg.png';
import { createStore, useStoreActions, useStoreState, StoreProvider } from 'easy-peasy';
import { storeModel } from './components/Dashboard/model.js';
import ChangesList from './components/Dashboard/ChangesList.js';
import PodcastIcon from './components/Dashboard/podcast.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import Particles from "react-particles-js";
import particleConfig from "./components/Home/particleConfig";
import EmailVerification from './components/Dashboard/EmailVerification.js';
import { ChakraProvider } from "@chakra-ui/react"

//FixedNavBar: leftmost black navbar (overview, record, settings, email)
//HorizontalNavBar: horizontal tabs (overview, speech, movement)

import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    useLocation
} from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  body {
    background-image: -webkit-linear-gradient(
      to right,
      #7db0db,
      #ff9922
    ); /* Chrome 10-25, Safari 5.1-6 */
    background-image: linear-gradient(
      to right,
      #7db0db,
      #ff9922
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
`;

const Container = styled.div``;

const Content = styled.div`
  margin-left: 40px;
`;

const DashboardContent = styled.div`
  width: calc(100% - ${props => props.currentWidthOfSearchContainer});
  transition: width 0.5s;
  float: right;
`;

//const store = createStore(pitchTopicsModel);
const store = createStore(storeModel);

function App() {
  const fetchPitchTopics = useStoreActions(actions => actions.pitchTopics.fetchPitchTopics);
  const [currentWidthOfSearchContainer, setCurrentWidthOfSearchContainer] = useState('280px');
  const [refresh, setRefresh] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = useStoreActions(actions => actions.user.fetchUserInfo);
  

  
  useEffect(() => {
    // setIsLoading(true);
    fetchPitchTopics();
    fetchUser();
    // setIsLoading(false);
  }, [refresh])

  // if(isLoading) {
  //   return null;
  // }

    return (
      <Container>
        <Router>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/dashboard/overview">
              <GlobalStyle />
              <FixedNavBar />
              <PitchTopicSearchContainer setCurrentWidthOfSearchContainerFromChild={(val) => setCurrentWidthOfSearchContainer(val)} currentWidthOfSearchContainer={currentWidthOfSearchContainer} />
              <DashboardContent currentWidthOfSearchContainer={currentWidthOfSearchContainer}>
                <OverviewSummaryRow />
                <HorizontalNavBar />
                <ToastProvider placement='bottom-center'>
                  <Overview setRefreshFromChild={() => setRefresh(!refresh)} />
                </ToastProvider>
              </DashboardContent>
            </Route>
            <Route path="/dashboard/speech">
              <GlobalStyle />
              <FixedNavBar />
              <PitchTopicSearchContainer setCurrentWidthOfSearchContainerFromChild={(val) => setCurrentWidthOfSearchContainer(val)} currentWidthOfSearchContainer={currentWidthOfSearchContainer} />
              <DashboardContent currentWidthOfSearchContainer={currentWidthOfSearchContainer}>
                <OverviewSummaryRow />
                <HorizontalNavBar />
                <ToastProvider placement='bottom-center'>
                  <Speech />
                </ToastProvider>
              </DashboardContent>
            </Route>
            <Route path="/dashboard/movement">
              <GlobalStyle />
              <FixedNavBar />
              <PitchTopicSearchContainer setCurrentWidthOfSearchContainerFromChild={(val) => setCurrentWidthOfSearchContainer(val)}  currentWidthOfSearchContainer={currentWidthOfSearchContainer}/>
                <DashboardContent currentWidthOfSearchContainer={currentWidthOfSearchContainer}>
                  <OverviewSummaryRow />
                  <HorizontalNavBar />
                  <ToastProvider placement='bottom-center'>
                    <Movement />
                  </ToastProvider>
                </DashboardContent>
            </Route>
            <Route path="/dashboard/record">
              <GlobalStyle />
              <FixedNavBar />
              <Content>
                <ToastProvider>
                  <AudioRecording setRefreshFromChild={() => setRefresh(!refresh)} />
                </ToastProvider>
              </Content>
            </Route>
            <Route path="/settings">
              <GlobalStyle />
              <FixedNavBar />
              <Content>
                <ToastProvider placement='bottom-center'>
                  <AccountSettingsPage />
                </ToastProvider>
              </Content>
            </Route>
            <Route path="/email">
              <FixedNavBar />
              <Content>
                <PageNotFound />
              </Content>
            </Route>
            <Route path="/changes">
              <FixedNavBar />
              <Content>
                <ChangesList />
              </Content>
            </Route>
            <Route path="/login">
              <ToastProvider placement='bottom-center'>
                <LoginRegister />
              </ToastProvider>
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/practice">
              <ToastProvider placement='bottom-center'>
                <TryItOutPage />
              </ToastProvider>
            </Route>
            <Route path="/verify-email/:token_slug">
              <EmailVerification />
            </Route>
            <Route>
              <Content>
                <PageNotFound />
              </Content>
            </Route>
          </Switch>
        </Router>
      </Container>
    );
}

const StyledPageNotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    height: 500px;
  }
`;

const PageNotFound = () => {
  return (
    <StyledPageNotFound>
      <h1>Page not found</h1>
      <img src={Dog} />
    </StyledPageNotFound>
  );
}

const PageHeading = styled.h1`
	font-family: "Open Sans", sans-serif;
	line-height: normal;
	text-align: center;
	color: #fff;
	font-size: 48px;
	margin-bottom: 30px;
	font-weight: 650;
	letter-spacing: 2px;
	text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.08);
`;

const Subtitle = styled.h2`
	color: #fff;
	margin-bottom: 45px;
	margin-top: 45px;
	font-weight: 300;
	font-size: 20px;
`;

const StyledOverviewSummaryRow = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-top: 25px;
    font-family: "Open Sans", sans-serif;
    line-height: normal;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 1px;
    text-shadow: 1px 1px black;
`;

const OverviewSummaryRowItem = styled.div`
  // color: #000000;
  padding: 20px;
  flex-basis: 30%;
  height: 125px;
  border-radius: 10px;
  // background-color: #FFFFFF;
  background-color: rgb(129, 209, 238, 0.7);
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);

  .number {
    // font-size: 56px;
    margin-left: 10px;
    font-size: 50px;
    text-shadow: 1px 1px black;
    color: #00c9fd;
    font-weight: 700;
    line-height: normal;
    color: #fff;
  }
`;

const NumberOfPitchTopics = styled(OverviewSummaryRowItem)``;

const NumberOfPitchesRecorded = styled(OverviewSummaryRowItem)`
  position: relative;

  img {
    position: absolute;
    right: 7%;
    top: 15%;
    height: 70%;
    width: auto;
  }
`;

const NumberOfMinutesPracticed = styled(OverviewSummaryRowItem)``;

const OverviewSummaryRow = () => {

  const pitchTopics = useStoreState(state => state.pitchTopics);

  const userProfile = useStoreState(state => state.user);

  function getTotalMinutesPracticed() {
    let totalDurationOfAllPitches = 0;
    for (let pitchTopic of pitchTopics.pitches) {
      let totalDurationOfPitch = 0;
      for (let pitch of pitchTopic.audio_files) {
        totalDurationOfPitch += parseInt(pitch.metrics.original_duration);
      }
      totalDurationOfAllPitches += totalDurationOfPitch;
    }
    return Math.ceil(totalDurationOfAllPitches/60);
  }

  function getName() {

    if(Object.keys(userProfile.userProfile).length === 0 && userProfile.userProfile.constructor === Object) {
      return null;
    }

    if(userProfile.userProfile.first_name) {
      return userProfile.userProfile.first_name;
    } else {
      return userProfile.userProfile.user.username;
    }
  }
  
  return (
    <div style={{ padding: "20px" }}>
    
      <PageHeading>{getName()}'s Dashboard</PageHeading>

      <StyledOverviewSummaryRow>
        
        <NumberOfPitchTopics>
          <span class="number">{pitchTopics.pitches.length}</span> pitch topics
        </NumberOfPitchTopics>

        <NumberOfPitchesRecorded>
          <span class="number">
            {
              pitchTopics.pitches.map((pitchTopic, index) => (
                pitchTopic.audio_files.length
              )).reduce((a, b) => a + b, 0)
            }
          </span> pitches recorded
          <img src={PodcastIcon} />
        </NumberOfPitchesRecorded>

        <NumberOfMinutesPracticed>
          <span class="number">
            {
              getTotalMinutesPracticed()
            }
          </span> minutes practiced
        </NumberOfMinutesPracticed>
      </StyledOverviewSummaryRow>
    </div>
  );
}

ReactDOM.render(
  // <ChakraProvider>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>,
  // </ChakraProvider>,
  document.getElementById('root'));

