const COLORS = {
    lapisLazuli: 'rgba(13, 95, 150, 1)', // Prompts color
    jade: 'rgba(33, 171, 114, 1)', // Water color
    alabaster: 'rgba(239, 231, 218, 1)', // Energy color
    red_orange: 'rgba(255, 83, 73, 1)',
    dark_green: `rgba(0, 38, 38, 1)`,
};

const ctx = document.getElementById('myChart').getContext('2d');

const day_in_the_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date();
const day_label = [];

for (let day = today.getDay() - 6; day <= today.getDay(); day++) {
    if (day < 0)
        day_label.push(day_in_the_week[day + 7]);
    else
        day_label.push(day_in_the_week[day]);
};

chrome.storage.local.get(['weeklyUsage'], (result) => {
    const weeklyUsage = result.weeklyUsage || Array.from({ length: 7 }, () => ({
        prompts: 0,
        energyUsed: 0,
        waterUsed: 0
    }));

    // Default data for prompts
    const promptData = weeklyUsage.map(dayObj => dayObj.prompts);
    const energyData = weeklyUsage.map(dayObj => dayObj.energyUsed);
    const waterData = weeklyUsage.map(dayObj => dayObj.waterUsed);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: day_label,
            datasets: [{
                label: 'Prompts for the last 7 days', // Default title
                data: promptData, // Default data
                borderWidth: 1,
                backgroundColor: COLORS.lapisLazuli,
                borderColor: 'rgba(0, 0, 0, 0)',
                borderRadius: 10,
                barThickness: 30
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Prompts for the last 7 days', // Title text
                    font: {
                        family: "Space Mono",
                        size: 18,
                        weight: 'bold'
                    },
                    color: COLORS.alabaster
                },
                legend: {
                    display: false
                },
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: "'Space Mono', sans-serif",
                            size: 12
                        },
                        color: COLORS.alabaster
                    },
                    title: {
                        display: false
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        font: {
                            family: "'Space Mono', sans-serif",
                            size: 12
                        },
                        color: COLORS.alabaster
                    },
                    title: {
                        display: false
                    },
                    grid: {
                        display: false
                    },
                    borderColor: COLORS.alabaster,
                    borderWidth: 2
                }
            }
        }
    });

    // Set up buttons
    const button1 = document.getElementById("button_1");
    const button2 = document.getElementById("button_2");
    const button3 = document.getElementById("button_3");

    // Function to update chart based on button pressed
    function updateChartData(type) {
        let newData, newColor, newLabel, newAxisLabel;

        if (type === 'prompts') {
            newData = promptData;
            newColor = COLORS.lapisLazuli;
            newLabel = 'Prompts for the last 7 days';
            newAxisLabel = "";
        } else if (type === 'water') {
            newData = waterData;
            newColor = COLORS.jade;
            newLabel = 'Water used for the last 7 days';
            newAxisLabel = "ml"
        } else if (type === 'energy') {
            newData = energyData;
            newColor = COLORS.red_orange;
            newLabel = 'Energy used for the last 7 days';
            newAxisLabel = "Wh"
        }

        chart.data.datasets[0].data = newData;
        chart.data.datasets[0].backgroundColor = newColor;
        chart.options.plugins.title.text = newLabel;
        chart.options.scales.y.title.text = newAxisLabel;
        chart.update();
    }

    // Button click event listeners
    button1.addEventListener('click', () => {
        updateChartData('prompts');
        button1.style.backgroundColor = COLORS.lapisLazuli;
        button2.style.backgroundColor = '';
        button3.style.backgroundColor = '';
    });

    button2.addEventListener('click', () => {
        updateChartData('water');
        button2.style.backgroundColor = COLORS.jade;
        button1.style.backgroundColor = '';
        button3.style.backgroundColor = '';
    });

    button3.addEventListener('click', () => {
        updateChartData('energy');
        button3.style.backgroundColor = COLORS.red_orange;
        button1.style.backgroundColor = '';
        button2.style.backgroundColor = '';
    });

    // Set default selection (prompts)
    button1.style.backgroundColor = COLORS.lapisLazuli;
});
