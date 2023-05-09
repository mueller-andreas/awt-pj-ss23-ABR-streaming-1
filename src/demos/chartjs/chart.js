// chart.js
// Get the chart context
const chartContext = document.getElementById('myChart').getContext('2d');

// Create the chart
const chart = new Chart(chartContext, {
    type: 'line',
    data: {
        labels: [0, 10000, 20000],
        datasets: [{
            label: 'Bandwidth Trajectory',
            data: [10000, 8000, 12000],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            stepped: true
        }]
    },
    options: {
        plugins: {
            dragData: true
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Duration (ms)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Speed (kbit/s)'
                },
                beginAtZero: true,
                suggestedMax: 15000
            }
        }
    }
});

// Add event listener for export button
document.getElementById('exportButton').addEventListener('click', () => {
    const data = chart.data.datasets[0].data;
    const labels = chart.data.labels;
    const output = data.map((speed, index) => ({
        duration: labels[index],
        speed
    }));
    console.log(JSON.stringify(output));
});

// Add event listener for add data point button
document.getElementById('addButton').addEventListener('click', () => {
    // Get the label and value from the input fields
    const label = parseInt(document.getElementById('labelInput').value);
    const value = parseInt(document.getElementById('valueInput').value);

    // Find the index where the new data point should be inserted
    let index = chart.data.labels.findIndex(l => l > label);
    if (index === -1) {
        index = chart.data.labels.length;
    }

    // Insert the new label and value at the found index
    chart.data.labels.splice(index, 0, label);
    chart.data.datasets[0].data.splice(index, 0, value);

    // Update the chart
    chart.update();
});


