import React from 'react';
import { action , thunk} from 'easy-peasy'; 
import { API_URL } from './../../constants.js';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch
} from 'react-router-dom';
export const pitchTopicsModel = {
    pitches: [], 
    fetchPitchTopics: thunk(async actions => {
        const res = await fetch(API_URL + "api/get_all_audio_data", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const pitchTopics = await res.json();
        actions.setPitchTopics(pitchTopics);
    }), 
    setPitchTopics: action((state, pitchTopics) => {
        // Go through each audio file in each pitch topic, to give a 'name' key to every audio file. Also getting the filler words for each audio file
        let pitchTopicsModified = pitchTopics.map((pitchTopic, index) => {
            let copyOfPitchTopic = Object.assign({}, pitchTopic);;
            copyOfPitchTopic.audio_files =  pitchTopic.audio_files.map((item ,index) => {
                let copyOfObject = Object.assign({}, item);
                copyOfObject.name= `Pitch ${index+1}`;
                return copyOfObject;
            })
            return copyOfPitchTopic;
        })
        state.pitches = pitchTopicsModified;
    })
}

export const currentlySelectedPitchTopicModel = {
    pitchTopic: {},
    setPitchTopic: action((state, pitchTopic) => {
        state.pitchTopic = pitchTopic;
    })
}

export const currentlySelectedAudioModel = {
    audioFile: {},
    setAudio: action((state, audio) => {
        state.audioFile = audio;
    })
}

export const loggedInUserProfileModel = {
    userProfile: {},
    fetchUserInfo: thunk(async actions => {
        const res = await fetch(API_URL + "api/profiles/logged_in", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include' // need this because we have [isLoggedIn] permission on endpoint
        });
        const profile = await res.json();
        actions.setUser(profile);
    }), 
    setUser: action((state, userProfile) => {
        state.userProfile = userProfile;
    })
}

export const storeModel = {
    pitchTopics: pitchTopicsModel, 
    selectedPitchTopic: currentlySelectedPitchTopicModel,
    selectedAudio: currentlySelectedAudioModel, 
    user: loggedInUserProfileModel
}