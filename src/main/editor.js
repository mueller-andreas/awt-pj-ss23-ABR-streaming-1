import { data } from "./modules/chart/data.js";
import { options } from "./modules/chart/options.js";
import { pluginCanvasBackgroundColor } from "./modules/chart/plugins.js";
import {
  onDragStart,
  onDrag,
  onDragEnd,
} from "./modules/chart/dragHandlers.js";
import { updateDataAndUI } from "./modules/chart/functions/updateFunctions.js";
import {
  saveChartData,
  loadChartData,
} from "./modules/chart/localStorage/localStorage.js";

// chart.js
// Get the chart context
const chartContext = document.getElementById("myChart").getContext("2d");

// Create the chart
const chart = new Chart(chartContext, {
  type: "line",
  data: data,
  options: options,
  plugins: [pluginCanvasBackgroundColor],
});

// // Add the chart events
// chart.options.plugins.dragData = { onDragStart, onDrag, onDragEnd };

// Add the chart events and bind this to the chart instance
chart.options.plugins.dragData.onDragStart = onDragStart.bind(chart);
chart.options.plugins.dragData.onDrag = onDrag.bind(chart);
chart.options.plugins.dragData.onDragEnd = onDragEnd.bind(chart);

// Call the loadChartData function when the page loads
loadChartData(chart);
// Call the updateDataAndUI function to initialize the page
updateDataAndUI(chart);

// Get the context menu element
const contextMenu = document.getElementById("contextMenu");

// Define function to add data point
function addDataPoint(chart, position) {
  // Get the label of the new data point based on the x position of the right-click
  let label = Math.round(chart.scales.x.getValueForPixel(position.x));
  // round x-value to nearest multiple of 100
  label = Math.round(label / 100) * 100;

  // Get the value of the new data point based on the y position of the right-click
  let value = chart.scales.y.getValueForPixel(position.y);
  // round y-value to nearest multiple of 100
  value = Math.round(value / 100) * 100;

  // Find the index where to insert the new data point
  let index = chart.data.datasets[0].data.findIndex(
    (dataPoint) => dataPoint.x > label
  );

  // @Todo probably not needed anymore
  if (index === -1) {
    // If the label is greater than any existing data point, add it to the end of the array
    console.log("Index == -1");
    index = chart.data.datasets[0].data.length;
  }

  // Insert the new data point into the dataset
  chart.data.datasets[0].data.splice(index, 0, { x: label, y: value });

  // Hide the context menu
  contextMenu.style.display = "none";
  updateDataAndUI(chart);
  chart.update();
  saveChartData(chart);
}

// Define function to delete data point
function deleteDataPoint(chart, activeElements) {
  // Get the index of the data point that was right-clicked
  const index = activeElements[0].index;

  // Delete point only if it is not the last data point
  if (index !== chart.data.datasets[0].data.length - 1) {
    // Delete the data point from the chart
    chart.data.datasets[0].data.splice(index, 1);
    chart.data.labels.splice(index, 1);

    // Hide the context menu
    contextMenu.style.display = "none";
    updateDataAndUI(chart);
    chart.update();
    saveChartData(chart);
  }
}

// Add event listener for contextmenu event on chart canvas
chart.canvas.addEventListener("contextmenu", (event) => {
  // Get the position of the canvas element relative to the page
  const canvasRect = chart.canvas.getBoundingClientRect();

  // Get the position of the event relative to the canvas
  const eventX = event.clientX - canvasRect.left;
  const eventY = event.clientY - canvasRect.top;

  // Get the chart area
  const chartArea = chart.chartArea;

  // Check if the right-click occurred within the chart area
  if (
    eventX >= chartArea.left &&
    eventX <= chartArea.right &&
    eventY >= chartArea.top &&
    eventY <= chartArea.bottom
  ) {
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
      contextMenu.innerHTML =
        '<a href="#" id="addDataPoint">Add Data Point</a>';

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
  }
});

// Add event listener for click event on document to hide context menu
document.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

// Add an event listener to the export button
document.getElementById("exportButton").addEventListener("click", function () {
  // Get the chart's base64 image string
  const chartImageURL = chart.toBase64Image();

  // Create a virtual anchor tag
  const downloadLink = document.createElement("a");
  downloadLink.href = chartImageURL;
  downloadLink.download = "chart.png";

  // Trigger the download
  downloadLink.click();
});
