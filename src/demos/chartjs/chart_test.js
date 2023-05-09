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

// Get the context menu element
const contextMenu = document.getElementById('contextMenu');
// Add event listener for contextmenu event on chart canvas
chart.canvas.addEventListener('contextmenu', (event) => {
    // Prevent the default context menu from appearing
    event.preventDefault();

    // Get the active elements at the event position
    const activeElements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

    // Check if the user right-clicked on a data point
    if (activeElements.length) {
        // Get the data point that was right-clicked
        const dataPoint = activeElements[0];

        // Update the context menu content
        contextMenu.innerHTML = '<a href="#" id="deleteDataPoint">Delete Data Point</a>';

        // Add event listener for delete data point option
        document.getElementById('deleteDataPoint').addEventListener('click', (event) => {
            // Prevent the link from navigating to a new page
            event.preventDefault();

            // Delete the data point from the chart
            chart.data.datasets[0].data.splice(dataPoint.index, 1);
            chart.update();

            // Hide the context menu
            contextMenu.style.display = 'none';
        });
    } else {
        // Get the position of the right-click
        const position = Chart.helpers.getRelativePosition(event, chart);

        // Get the value of the new data point based on the y position of the right-click
        const value = chart.scales.y.getValueForPixel(position.y);

        // Update the context menu content
        contextMenu.innerHTML = '<a href="#" id="addDataPoint">Add Data Point</a>';

        // Add event listener for add data point option
        document.getElementById('addDataPoint').addEventListener('click', (event) => {
            // Prevent the link from navigating to a new page
            event.preventDefault();
        
            // Get the value of the new data point based on the y position of the right-click
            const value = chart.scales.y.getValueForPixel(position.y);
        
            // Get the label of the new data point based on the x position of the right-click
            const label = Math.round(chart.scales.x.getValueForPixel(position.x));
        
            // Find the index where to insert the new data point
            const index = chart.data.labels.findIndex(l => l > label);
        
            // Insert the new data point into the dataset
            chart.data.datasets[0].data.splice(index, 0, value);
            chart.data.labels.splice(index, 0, label);
            chart.update();
        
            // Hide the context menu
            contextMenu.style.display = 'none';
        });
        
        
        
        
    }

    // Show the context menu at the position of the right-click
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.display = 'block';
});

// Add event listener for click event on document to hide context menu
document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
});
