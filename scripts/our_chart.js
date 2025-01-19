const COLORS = {
    lapisLazuli: 'rgba(13, 95, 150, 1)', // Example color for lapis lazuli
    jade: 'rgba(33, 171, 114, 1)', // Example color for jade
    alabaster: 'rgba(239, 231, 218, 1)', // Example color for alabaster
};

    const ctx = document.getElementById('myChart').getContext('2d');

    const day_in_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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

    const promptData = weeklyUsage.map(dayObj => dayObj.prompts);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: day_label,
            datasets: [{
                label: 'what you think it is',
                data: promptData,
                borderWidth: 1,
                backgroundColor: [
                    COLORS.lapisLazuli,
                    COLORS.lapisLazuli,
                    COLORS.lapisLazuli,
                    COLORS.lapisLazuli,
                    COLORS.lapisLazuli,
                    COLORS.lapisLazuli,
                    COLORS.lapisLazuli
                ],  
                
                borderColor: 'rgba(0, 0, 0, 0)',

                borderRadius: 10,
                barThickness: 30
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true, // Enables the title
                    text: 'Prompts for the last 7 days', // Title text
                    font: {
                        family: "Space Mono",
                        size: 18, // Title font size
                        weight: 'bold' // Title font weight
                    },
                    color: COLORS.alabaster
                },
                legend: {
                    display: false // Hides the legend
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
                        display: false, // Hide the x-axis title
                    },
                    grid: {
                        display: false // Hide grid lines
                    },
                },
                y: {
                    ticks: {
                        font: {
                            family: "'Space Mono', sans-serif",
                            size: 12
                        },
                        color: COLORS.alabaster // Y-axis ticks color set to alabaster
                    },
                    title: {
                        display: false // Hide the y-axis title
                    },
                    grid: {
                        display: false // Hide grid lines
                    },
                    // Y-axis line color
                    borderColor: COLORS.alabaster, 
                    borderWidth: 2
                }
            }
        }
    });
});
