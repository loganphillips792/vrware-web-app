import React from 'react';
import styled from 'styled-components';
import { ResponsiveLine } from '@nivo/line';
import 'antd/dist/antd.css';

const StyledChartsGrid = styled.div`
    display: grid;
    grid-auto-rows: 300px;
    grid-template-columns: 1fr 1fr;
    row-gap: 15px;
    margin-top: 50px;

    & > div {
        padding: 10px;
		margin: 10px;
		border-radius: 10px;
		box-shadow: 2px 4px 10px 3px rgba(0,0,0,0.2);
		background-color: rgb(0, 0, 0, 0.05);
        justify-self: center;
        // width: 100%;
        width: 95%;
        // https://stackoverflow.com/questions/59276119/nivo-responsive-line-graph-only-responsive-on-making-wider-not-making-narrower
        min-width: 0;
    }

    & > div:hover {
		background: rgb(0, 0, 0, 0.08);
	}

    .chart-title {
        //display: table;
        //margin: 0 auto;
        font-family: "Open Sans", sans-serif;
	    margin: 0 auto;
		display: table;
		font-size: 23px;
	    text-shadow: 1px 1px black;
	    color: #00c9fd;
	    font-weight: 600;
	    line-height: normal;
	    color: #fff;
    }

    // If device-width is less than or equal to 1000px
    @media (max-width: 1000px) {
        grid-template-columns: 1fr;

        & > div {
            width: 100%;
        }
    }
`;

const ChartsGrid = (props) => {

    const { data: chartsData  } = props;

    function getMinimumValueOfChart(id, dataARray) {
        if(id === 'rate of speech')
            return 80;
        else 
            return 0;
    }

    // this runs whenever we scroll on the page?
    function getMaximumValueOfChart(id, dataArray) {
        if(id === 'rate of speech') 
            return 180;
        else 
            return 100;
        // let max = Math.max.apply(Math, dataArray.map(function(o) {
        //     return o.y;
        // }));
       
        // let heightOfChart;
        // switch(id) {
        //     case 'pronunciation score':
        //         heightOfChart = Math.round(max) + 5;
        //         break;
        //     case 'pauses count':
        //         heightOfChart = Math.round(max) + 2;
        //         break;
        //     case 'rate of speech':
        //         heightOfChart = Math.round(max) + 2;
        //         break;
        //     case 'articulation rate':
        //         heightOfChart = Math.round(max) + .5;
        //         break;
        //     case 'original duration':
        //         heightOfChart = Math.round(max) + .5;
        //         break;
        // }

        // return heightOfChart;
    }

    function getObjectForChartById(id) {
        return chartsData.filter(obj => {
            return obj.id === id;
        })[0].objectForChart;
    }

    function renderCharts() {
        const metricsToUse = ['rate_of_speech', 'pronunciation_articulation_score', 'pause_score', 'filler_words_score', 'audio_score'];

        const chartsList = metricsToUse.map((metric, index) => {
            return (
                <div>
                    <span class="chart-title">{metric}</span>

                    <ResponsiveLine
                        data={getObjectForChartById(metric)}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: 'auto', max: getMaximumValueOfChart(getObjectForChartById(metric)[0].id, getObjectForChartById(metric)[0].data), stacked: true, reverse: false }}
                        axisTop={null}
                        axisRight={null}
                        colors={{ scheme: 'nivo' }}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabel="y"
                        pointLabelYOffset={-12}
                        useMesh={true}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 100,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 80,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground: 'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                </div>
            );
        })
        return chartsList;
    }

    return (
        <StyledChartsGrid>
            {renderCharts()}
        </StyledChartsGrid>
    );
}

export default ChartsGrid;