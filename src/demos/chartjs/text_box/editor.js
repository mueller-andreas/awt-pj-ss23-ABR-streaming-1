// chart.js
// Get the chart context
const chartContext = document.getElementById("myChart").getContext("2d");

// Create the chart
const chart = new Chart(chartContext, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Bandwidth Trajectory",
        data: [
          { x: 0, y: 10000 },
          { x: 10000, y: 8000 },
          { x: 20000, y: 12000 },
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        stepped: "after",
      },
    ],
  },
  options: {
    plugins: {
      dragData: {
        onDrag: function (e, datasetIndex, index, value) {
          // Get the data from the dataset
          const data = chart.data.datasets[datasetIndex].data;
          // Check if the current data point is not the first or last
          if (index > 0 && index < data.length - 1) {
            // Get the previous and next data points
            const prev = data[index - 1].x;
            const next = data[index + 1].x;
            // Limit the x value of the current data point to be between the previous and next data points
            value.x = Math.max(prev, Math.min(next, value.x));
          }
          return value;
        },
        onDragEnd: function (e, datasetIndex, index, value) {
          console.log("onDragEnd", e, datasetIndex, index, value);

          // Get the data from the dataset
          const data = chart.data.datasets[datasetIndex].data;
          // Check if the current data point is not the first or last
          if (index > 0 && index < data.length - 1) {
            // Get the previous and next data points
            const prevIndex = index - 1;
            const nextIndex = index + 1;
            const prev = data[prevIndex].x;
            const next = data[nextIndex].x;

            console.log(value);
            console.log(prevIndex);
            console.log(nextIndex);
            console.log(prev);
            console.log(next);

            console.log(value.x);

            // Check if the current data point is at the same x position as one of its neighbors
            if (value.x === prev) {
              // Remove the previous data point
              data.splice(prevIndex, 1);
            } else if (value.x === next) {
              // Remove the next data point
              data.splice(nextIndex, 1);
            }
          }
        },
        round: 1,
        dragX: true,
        magnet: {
          to: Math.round, // to: (value) => value + 5
        },
      },
    },

    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Duration (ms)",
        },
        min: 0,
        max: 20000,
        stepSize: 1,
      },
      y: {
        title: {
          display: true,
          text: "Speed (kbit/s)",
        },
        beginAtZero: true,
        suggestedMax: 15000,
        stepSize: 1,
      },
    },
  },
});

// Add event listener for export button
document.getElementById("exportButton").addEventListener("click", () => {
  const data = chart.data.datasets[0].data;
  const labels = chart.data.labels;
  const output = data.map((speed, index) => ({
    duration: labels[index],
    speed,
  }));
  console.log(JSON.stringify(output));
});

// Define function to add data point
function addDataPoint(chart, position) {
  // Get the value of the new data point based on the y position of the right-click
  const value = chart.scales.y.getValueForPixel(position.y);

  // Get the label of the new data point based on the x position of the right-click
  const label = Math.round(chart.scales.x.getValueForPixel(position.x));

  // Find the index where to insert the new data point
  let index = chart.data.datasets[0].data.findIndex(
    (dataPoint) => dataPoint.x > label
  );

  if (index === -1) {
    // If the label is greater than any existing data point, add it to the end of the array
    index = chart.data.datasets[0].data.length;
  }

  // Insert the new data point into the dataset
  chart.data.datasets[0].data.splice(index, 0, { x: label, y: value });
  chart.update();

  // Hide the context menu
  contextMenu.style.display = "none";
}

// Define function to delete data point
function deleteDataPoint(chart, activeElements) {
  // Get the index of the data point that was right-clicked
  const index = activeElements[0].index;

  // Delete the data point from the chart
  chart.data.datasets[0].data.splice(index, 1);
  chart.data.labels.splice(index, 1);
  chart.update();

  // Hide the context menu
  contextMenu.style.display = "none";
}

// Get the context menu element
const contextMenu = document.getElementById("contextMenu");

// Add event listener for contextmenu event on chart canvas
chart.canvas.addEventListener("contextmenu", (event) => {
  // Prevent the default context menu from appearing
  event.preventDefault();

  // Get the active elements at the event position
  const activeElements = chart.getElementsAtEventForMode(
    event,
    "nearest",
    { intersect: true },
    true
  );

  // Check if the user right-clicked on a data point
  if (activeElements.length) {
    // Update the context menu content
    contextMenu.innerHTML =
      '<a href="#" id="deleteDataPoint">Delete Data Point</a>';

    // Add event listener for delete data point option
    document
      .getElementById("deleteDataPoint")
      .addEventListener("click", (event) => {
        // Prevent the link from navigating to a new page
        event.preventDefault();

        // Pass the entire activeElements array to the function
        deleteDataPoint(chart, activeElements);
      });
  } else {
    // Get the position of the right-click
    const position = Chart.helpers.getRelativePosition(event, chart);

    // Update the context menu content
    contextMenu.innerHTML = '<a href="#" id="addDataPoint">Add Data Point</a>';

    // Add event listener for add data point option
    document
      .getElementById("addDataPoint")
      .addEventListener("click", (event) => {
        // Prevent the link from navigating to a new page
        event.preventDefault();

        addDataPoint(chart, position);
      });
  }

  // Show the context menu at the position of the right-click
  contextMenu.style.top = `${event.clientY}px`;
  contextMenu.style.left = `${event.clientX}px`;
  contextMenu.style.display = "block";
});

// Add event listener for click event on document to hide context menu
document.addEventListener("click", () => {
  contextMenu.style.display = "none";
});
