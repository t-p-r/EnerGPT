const COLORS = {
    lapisLazuli: 'rgba(13, 95, 150, 1)', // Example color for lapis lazuli
    jade: 'rgba(33, 171, 114, 1)', // Example color for jade
    alabaster: 'rgba(239, 231, 218, 1)', // Example color for alabaster
};

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
            label: 'ChatGPT Queries',
            data: [12, 19, 3, 5, 2, 3, 4],
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
            borderColor: 'rgba(0, 0, 0, 0)', // Transparent border for bars
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
