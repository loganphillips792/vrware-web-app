import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle }  from 'styled-components';
import MultiStepForm from './MultiStepForm.js';
import { Button } from '@material-ui/core';

const ModalContainer = styled.div`
    display: ${({show}) => show ? 'block' : 'none'};
    background-color: rgba(0, 0, 0, .6);
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 2;
`;

const PreviousButton = styled.button`

`;

const NextButton = styled.button`

`;

const ModalContent = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FFF;
    //width: 50%;
    //height: 50%;
    width: 80vw;
    height: 80vh;
    color: #000;
    font-size: 15px;
    //font-weight: 600;
`;

const Header = styled.div`
    // To position .close-button, .title and .prev-next-button-container
    position: relative;
    display: flex;
    width: 100%;
    height: 10%;
    justify-content: space-between;

    .close-button {
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
    }

    h1 {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .prev-next-buttons-container {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
    }
`;

const Body = styled.div`
    height: 80%;
`;

const Footer = styled.div`
    // To position <BulletContainer />
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 10%;
`;

const BulletsContainer = styled.div`
    position: absolute;
    bottom: 0;
`;

const Bullet = styled.div`
    background-color: ${({ index, currentStep }) => index === currentStep ? '#06f' : '#d8d8da' };
    // background-color: #d8d8da;
    border-radius: 50%;
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 3px;
    transition: background-color .15s ease;
    cursor: pointer;
    
    &:hover {
        background-color: #b1b0b5;
    }
`;

const DisableScroll = createGlobalStyle`
  body {
    overflow-y: hidden;
  }
`

// Just a wizard form (AKA multi-step form) inside a modal
const ImprovementEngineModal = ({ pitch, show, closeModalFromChild }) => {
    const [currentStep, setCurrentStep] = useState(1);

    const [improvementData, setImprovementData] = useState([]);

    useEffect(() => {
        getImprovementData();
    }, [])

    const handleChange = e => {
        const {name, value} = e.target;
        setCurrentStep(value);
    }

    const next = () => {
        setCurrentStep(currentStep >= 7 ? 8 : currentStep + 1);
    }

    const prev = () => {
        setCurrentStep(currentStep <= 1 ? 1 : currentStep - 1);
    }

    function getFirstMetricToImprove() {
        const arr = improvementData.filter(obj => obj.needsImprovement == true);
        return arr[0];
    }

    function getSecondMetricToImprove() {
        const arr = improvementData.filter(obj => obj.needsImprovement == true);
        return arr[1];
    }

    const getTitle = () => {
        let title = "";
        switch(currentStep) {
            case 1:
                title = "Overview";
                break;
            case 2:
                title = "What you could improve";
                break;
            case 3:
                title = `Prepare to Improve - ${getFirstMetricToImprove().nameToDisplay}`;
                break;
            case 4:
                title = `Improve - ${getFirstMetricToImprove().nameToDisplay}`;
                break;
            case 5:
                title = `Results - ${getFirstMetricToImprove().nameToDisplay}`;
                break;
            case 6:
                title = `Prepare to Improve - ${getSecondMetricToImprove().nameToDisplay}`;
                break;
            case 7:
                title = `Improve - ${getSecondMetricToImprove().nameToDisplay}`;
                break;
            case 8:
                title = `Results - ${getSecondMetricToImprove().nameToDisplay}`;
                break;
        }
        return title;
    }

    const getImprovementData = () => {

        let metricsPriority = [
            {
                metric: "rate_of_speech_slow", 
                nameToDisplay: "Words per Minute - Slow", 
                needsImprovement: false, 
                valueBeforeImprovement: 0, 
                promptForPrepareToImprove: "Speaking slowly at certain times during a pitch can have positive outcomes. However, speaking too slowly during the whole pitch will cause your audience to lose interest in your message.", 
                promptForExamples: "Take a listen for yourself",
                goodExampleOne: {
                    'name': 'Admiral\'s commencement speech',
                    'content': 'This is a good spech because blah blah blah',
                    'url': 'https://www.youtube.com/watch?v=6jjhxeHIjvU&ab_channel=WinstonChurchillSpeeches',
                },
                goodExampleTwo: {
                },
                badExampleOne: {
                    'name': 'Winston Churchill',
                    'content': 'This one sucks because ya know',
                    'url': 'https://www.youtube.com/watch?v=6jjhxeHIjvU&ab_channel=WinstonChurchillSpeeches',
                },
                promptsForPracticePassage: ["Give it a try! Read this transcription of your recent pitch and focus on speaking at an appropriate rate. Taking a breath between sentences helps reset your focus!", "Give it a try! Read this transcription of your recent pitch and focus on speaking at an appropriate rate.  Take a moment before you begin to plan your intonation and choose a few pieces you want to emphasize.", "Give it a try! Read this transcription or your recent pitch and focus on speaking at an appropriate rate. Plan your pauses around words and phrases that you want to emphasize to your audience!"], 
                practicePassage: "",
                tips: ["Tip 1", "Tip 2", "Tip 3"], 
                goalValue: 100,
                results: {
                    'results': []
                }
            },{
                metric: "rate_of_speech_fast", 
                nameToDisplay: "Words per Minute - Fast", 
                needsImprovement: false, 
                valueBeforeImprovement: 0, 
                promptForPrepareToImprove: "Speaking quickly at certain times during a pitch can show excitement and grab the audience’s attention. However, speaking too quickly for the whole pitch will make it hard for your audience to keep up with your message as they try to comprehend and think about each of your statements.", 
                promptForExamples: "Take a listen for yourself",
                goodExampleOne: {
                    'name': 'Admiral\'s commencement speech',
                    'content': 'This is a good spech because blah blah blah',
                    'url': 'https://www.youtube.com/watch?v=6jjhxeHIjvU&ab_channel=WinstonChurchillSpeeches',
                },
                goodExampleTwo: {
                },
                badExampleOne: {
                    'name': 'Winston Churchill',
                    'content': 'This one sucks because ya know',
                    'url': 'https://www.youtube.com/watch?v=6jjhxeHIjvU&ab_channel=WinstonChurchillSpeeches',
                },
                promptsForPracticePassage: ["Give it a try! Read this transcription of your recent pitch and focus on speaking at an appropriate rate. Taking a breath between sentences helps reset your focus!", "Give it a try! Read this transcription of your recent pitch and focus on speaking at an appropriate rate.  Take a moment before you begin to plan your intonation and choose a few pieces you want to emphasize.", "Give it a try! Read this transcription or your recent pitch and focus on speaking at an appropriate rate. Plan your pauses around words and phrases that you want to emphasize to your audience!"], 
                practicePassage: "",
                tips: ["Tip 1", "Tip 2", "Tip 3"], 
                goalValue: 100, 
                results: {
                    'results': []
                }
            },
            {
                metric: "pronunciation_score",
                nameToDisplay: "Pronunciation Score",
                needsImprovement: false, 
                valueBeforeImprovement: 0, 
                promptForPrepareToImprove: "Articulation is the formation of clear and distinct sounds in your speech. It is important to have good articulation so that others can easily understand you and focus on the content of your speech, not on figuring out what you’re saying.", 
                promptForExamples: "Take a listen to these two sample speeches",
                goodExampleOne: {
                    'name': 'Cities are driving climate change',
                    'content': 'This is good because',
                    'url': 'https://www.ted.com/talks/angel_hsu_cities_are_driving_climate_change_here_s_how_they_can_fix_it',
                },
                goodExampleTwo: {
                },
                badExampleOne: {
                    'name': 'Marshawn Lynch',
                    'content': 'This is bad because...',
                    'url': 'https://www.youtube.com/watch?v=qiV7CjLVQEk&ab_channel=TheSportsDaily',
                },
                promptsForPracticePassage: ["Give it a try! Read this poem out loud, focusing on good rhythm as it will help your pronunciation"], 
                practicePassage: "I take it you already know Of tough and bough and cough and dough Others may stumble, but not you On hiccough, thorough, laugh, and through. And cork and work and card and ward And font and front and word and sword Well done! And now if you wish, perhaps To learn of less familiar traps.",
                tips: ["Tip 1", "Tip 2", "Tip 3"], 
                goalValue: 100, 
                results: {
                    'results': []
                }
            }, {
                metric: "pause_score",
                nameToDisplay: "Pause Score",
                needsImprovement: false, 
                valueBeforeImprovement: 0, 
                promptForPrepareToImprove: "Pausing during your speech is a great way to focus the audience on your message and give yourself a chance to prepare for your next statement.", 
                promptForExamples: "Listen to these two clips and decide which one you’re able to understand best!",
                goodExampleOne: {
                    'name': 'TwoDoo Pitch',
                    'content': 'This is a good spech because blah blah blah',
                    'url': 'https://www.youtube.com/watch?v=7a_lu7ilpnI&ab_channel=JeffBax',
                },
                goodExampleTwo: {
                    'name': '',
                    'content': 'This is a good spech because blah blah blah',
                    'url': 'https://www.ted.com/talks/nora_flanagan_what_covid_19_revealed_about_us_schools_and_4_ways_to_rethink_education',
                },
                badExampleOne: {
                    'name': 'Elon Musk - Neuralink Demo',
                    'content': 'This one sucks because ELON',
                    'url': 'https://www.youtube.com/watch?v=sr8hzF3j2fo&ab_channel=CNETHighlights',
                },
                promptsForPracticePassage: ["Try reading this passage from the Grapes of Wrath. Focus on pausing around the bolded words"], 
                practicePassage: "The last clear definite function of <b>man</b>—muscles aching to <b>work</b>, minds aching to create beyond the single <b>need</b>—this is <b>man</b>. To build a <b>wall</b>, to build a <b>house</b>, a <b>dam</b>, and in the wall and house and dam to put something of <b>Manself</b>, and to Manself take back something of the <b>wall</b>, the house the <b>dam</b>; to take hard muscles from the <b>lifting</b>, to take the clear lines and form from conceiving. For man, unlike any other thing organic or inorganic in the <b>universe</b>, grows beyond his <b>work</b>, walks up the stairs of his <b>concepts</b>, emerges ahead of his accomplishments.",
                tips: ["Tip 1", "Tip 2", "Tip 3"], 
                goalValue: 100, 
                results: {
                    'results': []
                }
            },
            {
                metric: "filler_words_score",
                nameToDisplay: "Filler words score",
                needsImprovement: false,
                valueBeforeImprovement: 0,
                promptForPrepareToImprove: "The excessive use of filler words is the most common error that new public speakers make. Using too many filler words can detract from your credibility and confidence, making it tougher to convince your audience of what you’re saying.", 
                promptForExamples: "",
                goodExampleOne: {
                    'name': '',
                    'content': '',
                    'url': '',
                },
                goodExampleTwo: {
                },
                badExampleOne: {
                    'name': '',
                    'content': '',
                    'url': '',
                },
                promptsForPracticePassage: ["Practice:Give it a try! Read this transcription or your recent pitch and try to think about each word you’re saying.  We have removed all of the filler words from your transcript so that you can practice giving a speech with confidence!"],
                practicePassage: "",
                tips: ["Tip 1", "Tip 2", "Tip 3"],
                goalValue: 100, 
                results: {
                    'results': []
                }
            }
        ]

        let keys = metricsPriority.map((el => el.metric));
        for (const metricProperty of keys) {
            let improve = metricNeedsToBeImproved(metricProperty)
            let index = metricsPriority.findIndex(obj => obj.metric == metricProperty);

            if(improve) {
                metricsPriority[index].needsImprovement = true;
                metricsPriority[index].valueBeforeImprovement = pitch.metrics[metricProperty];
            }

            if(!metricsPriority[index].practicePassage && pitch.transcript) {
                metricsPriority[index].practicePassage = pitch.transcript;
            }

            /*
                // DOES NOT WORK. USE CODE DIRECTLY ABOVE
                // If practice passage is empty string, then we use transcript
                let obj = metricsPriority.filter(obj => obj.metric === metricProperty);
                if(pitch.transcript) {
                    console.log("TRANSCRIPT AVAILABLE")
                    obj.practicePassage = pitch.transcript;
                    console.log("OBJECT", obj);
                }
            */

            
        }
        setImprovementData(metricsPriority);
    }

    // This gets passed all the way down to
    const addResultsToObjectInPriorityList = (key, value) => {
        let index = improvementData.findIndex(obj => obj.metric == key);
        let tempArray = improvementData.slice();
        tempArray[index].results.results.push(value);
        setImprovementData(tempArray)
    }

    const metricNeedsToBeImproved = (metricProperty) => {
        
        let metric = pitch.metrics[metricProperty];

        switch (metricProperty) {
            case 'rate_of_speech_slow':
                if (parseFloat(metric) < 115) {
                    return false;
                } else {
                    return true;
                }
            case 'rate_of_speech_fast':
                if (parseFloat(metric) > 160) {
                    return true;
                } else {
                    return false;
                }
            case 'pronunciation_score':
                if (parseFloat(metric) >= 90 && parseFloat(metric) <= 100) {
                    return false;
                } else {
                    return true;
                }
            case 'pause_score':
                if (parseFloat(metric) >= 90 && parseFloat(metric) <= 100) {
                    return false;
                } else {
                    return true;
                }
            case 'pauses_count':
                if (parseFloat(metric) >= 90 && parseFloat(metric) <= 100) {
                    return false;
                } else {
                    return true;
                }
            case 'filler_words_score':
                if (parseFloat(metric) >= 90 && parseFloat(metric) <= 100) {
                    return false;
                } else {
                    return true;
                }
        }
    }

    const closeWizard = () => {
        closeModalFromChild(); 
        setCurrentStep(1); 
    }

    return (
        <ModalContainer show={show}>
            {show &&  <DisableScroll />}
            <ModalContent>
                <Header>
                    <div class="close-button" onClick={closeWizard}>X</div>
                    {/* <div class="title"></div> */}
                    <h1 class="title">{getTitle()}</h1>
                    <div class="prev-next-buttons-container">
                        {currentStep !==1 &&
                            <PreviousButton onClick={prev}>
                                Previous
                            </PreviousButton>
                        }
                        {currentStep !==8 && 
                            <NextButton onClick={next}>
                                Next
                            </NextButton>
                        }
                        {currentStep === 8 &&
                            <Button variant="contained" color="secondary" onClick={closeWizard}>
                                Close
                            </Button>
                        }
                    </div>
                </Header>

                <Body>
                    <MultiStepForm improvementData={improvementData} addResultsToObjectInPriorityList={addResultsToObjectInPriorityList} currentStep={currentStep} setCurrentStep={(val) => setCurrentStep(val)} handleChange={handleChange} />
                </Body>
                
                <Footer>
                <BulletsContainer>
                    <Bullet onClick={() => setCurrentStep(1)} index={1} currentStep={currentStep}></Bullet>
                    <Bullet onClick={() => setCurrentStep(2)} index={2} currentStep={currentStep}></Bullet>
                    <Bullet onClick={() => setCurrentStep(3)} index={3} currentStep={currentStep}></Bullet>
                    <Bullet onClick={() => setCurrentStep(4)} index={4} currentStep={currentStep}></Bullet>
                    <Bullet onClick={() => setCurrentStep(5)} index={5} currentStep={currentStep}></Bullet>
                    <Bullet onClick={() => setCurrentStep(6)} index={6} currentStep={currentStep}></Bullet>
                    <Bullet onClick={() => setCurrentStep(7)} index={7} currentStep={currentStep}></Bullet>
                    <Bullet onClick={() => setCurrentStep(8)} index={8} currentStep={currentStep}></Bullet>
                </BulletsContainer>
                </Footer>
            </ModalContent>
        </ModalContainer>
    );
}

export default ImprovementEngineModal;