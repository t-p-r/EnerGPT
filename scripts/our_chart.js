const ctx = document.getElementById('myChart').getContext('2d');

const day_in_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const today = new Date();

const label = [];

for (let day = today.getDay() - 6; day <= today.getDay(); day++) {
    if (day < 0)
        label.push(day_in_the_week[day + 7]);
    else
        label.push(day_in_the_week[day]);
};

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: label,
        datasets: [{
            label: 'what you think it is',
            data: [12, 19, 3, 5, 2, 3, 10],
            borderWidth: 1,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ]
        }]
    },
    options: {
        plugins: {
            title: {
                display: true, // Enables the title
                text: 'Prompts by day:', // Title text
                font: {
                    size: 18, // Title font size
                    weight: 'bold' // Title font weight
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});