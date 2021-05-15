import React from 'react';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
import MetricsTable from './MetricsTable.js';
import SelectPitchTopic from '../../shared_components/SelectPitchTopic.js';
import ChartsGrid from './ChartsGrid.js';
import { ResponsivePie } from '@nivo/pie'

const Container = styled.div`
    padding: 0 30px 0 30px;
    .data {
        border: 2px solid red;
        width: 100%;
    }

    .pie-chart-container {
        height: 300px;
    }
`;

const MainHeading = styled.h1`
	font-family: "Open Sans", sans-serif;
	line-height: normal;
	color: #fff;
	font-size: 30px;
	margin-top: 0;
	margin-bottom: 20px;
	font-weight: 600;
	letter-spacing: 2px;
	text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.05);
`;

const Speech = () => {
    const selectedPitchTopic = useStoreState(store => store.selectedPitchTopic);
    const selectedPitch = useStoreState(store => store.selectedAudio);

    function getPitchMetricDataForCharts(pitchesList) {
        const metricsToUse = ['rate_of_speech', 'pronunciation_articulation_score', 'pause_score', 'filler_words_score', 'audio_score', 'original_duration'];
        
        let chartMetrics=[];
        for(const metric of metricsToUse) {
            let temp = [{
                id: metric
            }];

            temp[0].data = pitchesList.map(function (pitch, index) {
                return {
                    x: `Pitch ${index+1}`,
                    y: pitch.metrics[metric]
                }
            })

            chartMetrics.push({ id: metric, objectForChart: temp })
        }
        return chartMetrics;
    }
    
    if(Object.keys(selectedPitchTopic.pitchTopic).length === 0 && selectedPitchTopic.pitchTopic.constructor === Object) {
        return <SelectPitchTopic />
    }

    function getPieChartData() {
        if(Object.keys(selectedPitch.audioFile.metrics.filler_words).length === 0 && selectedPitch.audioFile.metrics.filler_words.constructor === Object) {
            return [];
        }

        let listOfFillerWordsDict = [];
        // need to switch single quotes to double 
        let filler_words_dict = JSON.parse(selectedPitch.audioFile.metrics.filler_words.replace(/'/g, '"'));
        for(const key in filler_words_dict) {
            let tempDict = {
                id: key,
                label: key,
                value: filler_words_dict[key],
            }
        listOfFillerWordsDict.push(tempDict);
        }
        return listOfFillerWordsDict;
    }

    return (
        <Container>
            <MainHeading>Speech metrics for {selectedPitchTopic.pitchTopic.name}</MainHeading>
            <MetricsTable audioList={selectedPitchTopic.pitchTopic.audio_files}/>
            {
                Object.keys(selectedPitch.audioFile).length === 0 && selectedPitch.audioFile.constructor === Object
                ?
                <ChartsGrid
                    data={getPitchMetricDataForCharts(selectedPitchTopic.pitchTopic.audio_files)}
                />
                :
                <div>
                    <p>Showing specific metrics for {selectedPitch.audioFile.name}</p>
                    {getPieChartData(selectedPitch.audioFile.id).length === 0
                        ?
                        <div class="no-filler-words-label">
                            <p>No filler words found</p>
                        </div>
                        :
                        <div class="pie-chart-container">
                            <span>Filler words</span>
                            <PieChart data={getPieChartData()}/>
                        </div>
                    }
                </div>
            }
        </Container>
    );
}

export default Speech;

const PieChart = ({data}) => {
    return (
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: 'color' }}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'c'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'go'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'python'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'scala'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'lisp'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'elixir'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'javascript'
                    },
                    id: 'lines'
                }
            ]}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    translateY: 56,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
        />
    )
}