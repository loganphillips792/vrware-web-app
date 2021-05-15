import React from 'react';
import styled from 'styled-components';
import { ImprovementOverview, WhatYouCouldImprove, PrepareToImproveMetric, ImproveMetric, ResultsOfMetric } from './Steps.js';
import ProgressSVG from './backgrounds/progress.svg';
import BlocksSVG from './backgrounds/blocks.svg';
import MotivationSVG from './backgrounds/motivation.svg';
import PresentationSVG from './backgrounds/conference_presentation.svg';

const Container = styled.div`
    position: relative;
    height: 100%;

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
    }
`;

const MultiStepForm = ({currentStep, handleChange, improvementData, addResultsToObjectInPriorityList}) => {

    function renderCorrectBackgroundImage() {
        let background_image = null;

        switch(currentStep) {
            case 1:
                background_image = <img src={ProgressSVG}  alt="image" />;
                break;
            case 2:
                background_image = <img src={BlocksSVG}  alt="image" />;
                break;
            case 3:
                background_image = <img src={MotivationSVG} alt="image" />
                break;
            case 4:
                background_image = <img src={PresentationSVG} alt="image" />
                break;
            case 5:
                background_image = <img src={MotivationSVG} alt="image" />
                break;
            case 6:
                background_image = <img src={PresentationSVG} alt="image" />
                break;
            case 7:
                break;
            case 8:
                break;
        }
        return background_image;
    }


    function getFirstMetricToImprove() {
        const arr = improvementData.filter(obj => obj.needsImprovement == true);
        return arr[0];
    }

    function getSecondMetricToImprove() {
        const arr = improvementData.filter(obj => obj.needsImprovement == true);
        return arr[1];
    }

    return(
        <Container>
            {renderCorrectBackgroundImage()}

            <ImprovementOverview
                currentStep={currentStep}
                handleChange={handleChange}
                improvementData={improvementData}
                pageNumber={1}
            />

            <WhatYouCouldImprove  
                currentStep={currentStep}
                handleChange={handleChange}
                improvementData={improvementData}
                pageNumber={2}
            />

            <PrepareToImproveMetric
                currentStep={currentStep}
                handleChange={handleChange}
                improvementData={getFirstMetricToImprove()}
                pageNumber={3}
            />

            <ImproveMetric
                currentStep={currentStep}
                handleChange={handleChange}
                improvementData={getFirstMetricToImprove()}
                pageNumber={4}
                addResultsToObjectInPriorityList={addResultsToObjectInPriorityList}
            />

            <ResultsOfMetric 
                currentStep={currentStep}
                handleChange={handleChange}
                improvementData={getFirstMetricToImprove()}
                pageNumber={5}
            />

            <PrepareToImproveMetric
                currentStep={currentStep}
                handleChange={handleChange}
                improvementData={getSecondMetricToImprove()}
                pageNumber={6}
            />

            <ImproveMetric
                currentStep={currentStep}
                handleChange={handleChange}
                improvementData={getSecondMetricToImprove()}
                pageNumber={7}
                addResultsToObjectInPriorityList={addResultsToObjectInPriorityList}
            />

            <ResultsOfMetric 
                currentStep={currentStep}
                handleChange={handleChange}
                improvementData={getSecondMetricToImprove()}
                pageNumber={8}
            />

        </Container>
    );
}

export default MultiStepForm;