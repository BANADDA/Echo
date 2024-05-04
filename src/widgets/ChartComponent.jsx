import Chart from 'chart.js/auto';
import React, { useEffect, useState } from 'react';

const colorMap = {
    'gpt': '#FF6384',
    'bert': '#36A2EB',
    't5': '#FFCE56',
    'llama': '#4BC0C0',
    'roberta': '#9966FF',
    'transformer': '#FF9F40',
    'xlnet': '#C9CBCF'
};

const ChartComponent = ({ jobs }) => {
    const [chartData, setChartData] = useState({});
    const llmTypes = ['gpt', 'bert', 't5', 'llama', 'roberta', 'transformer', 'xlnet'];

    useEffect(() => {
        const data = fetchData(jobs);
        const processedData = processForChart(data);
        setChartData(processedData);

        const ctx = document.getElementById('myChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: processedData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Model Type Count',
                            color: '#111',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Occurrences',
                            color: '#111',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'black'  // Adjust the color of legend text
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                }
            }
        });

        return () => chart.destroy();
    }, [jobs]);

    const fetchData = (jobs) => {
        return jobs;
    };

    const processForChart = (data) => {
        const groupedByDateAndType = {};

        data.forEach(item => {
            const date = new Date(item.createdAt.seconds * 1000).toLocaleDateString();
            const modelType = getModelType(item.baseModel || item.suffix);
            if (!groupedByDateAndType[date]) {
                groupedByDateAndType[date] = {};
            }
            if (!groupedByDateAndType[date][modelType]) {
                groupedByDateAndType[date][modelType] = 1;
            } else {
                groupedByDateAndType[date][modelType]++;
            }
        });

        const labels = Object.keys(groupedByDateAndType);
        const datasets = llmTypes.map(type => ({
            label: type.toUpperCase(),
            data: labels.map(label => groupedByDateAndType[label][type] || 0),
            borderColor: colorMap[type],  // Use predefined colors
            fill: false,
            tension: 0.1
        }));

        return { labels, datasets };
    };

    const getModelType = (modelName) => {
        return llmTypes.find(type => modelName.toLowerCase().includes(type)) || 'other';
    };

    return (
        <div className='bg-slate-100' style={{ height: '350px', width: '100%' }}> {/* Container to control size */}
            <canvas id="myChart"></canvas>
        </div>
    );
};

export default ChartComponent;
