const COLORS = {
    lapisLazuli: 'rgba(13, 95, 150, 1)',
    coyote: 'rgba(111, 98, 73, 1)',
    jade: 'rgba(33, 171, 114, 1)',
    alabaster: 'rgba(239, 231, 218, 1)',
    darkGreen: 'rgba(0, 38, 38, 1)',
};

const ctx = document.getElementById('myChart').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Sun' ,'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
            borderColor: [
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
            ],
            borderRadius: 10,
            barThickness: 30
        }]
    },
    options: {
        plugins: {
            title: {
                display: true, // Enables the title
                text: 'Your Consumption', // Title text
                font: {
                    family: "Space Mono",
                    size: 18, // Title font size
                    weight: 'bold' // Title font weight
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
                        family: "'Roboto', sans-serif",
                        size: 12
                    },
                    color: COLORS.alabaster
                },
                title: {
                    display: false,
                },
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    display: false
                },
                title: {
                    display: false
                },
                grid: {
                    display: false
                }
            }
        }
    },
    backgroundColor: COLORS.alabaster
});