import { onDragStart, onDrag, onDragEnd } from "./dragHandlers.js";
import { options } from "./options.js";
// chart.js
// Get the chart context
const chartContext = document.getElementById("myChart").getContext("2d");

const pluginCanvasBackgroundColor = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#99ffff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

// Create the chart
const chart = new Chart(chartContext, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Bandwidth Trajectory",
        data: [
          { x: 0, y: 8000 },
          { x: 5000, y: 8000 },
          { x: 10000, y: 1000 },
          { x: 20000, y: 12000 },
        ],
        borderColor: "rgb(67, 155, 255)",
        backgroundColor: "rgba(67, 155, 255, 0.5)",
        stepped: "after",
        // Disable the first point
        pointHitRadius: function (context) {
          return context.dataIndex === 0 ? 0 : 1;
        },
        pointRadius: function (context) {
          return context.dataIndex === 0 ? 0 : 3;
        },
      },
    ],
  },

  options: options,
  plugins: [pluginCanvasBackgroundColor],
});

// Add the chart events and bind this to the chart instance
chart.options.plugins.dragData.onDragStart = onDragStart.bind(chart);
chart.options.plugins.dragData.onDrag = onDrag.bind(chart);
chart.options.plugins.dragData.onDragEnd = onDragEnd.bind(chart);

// Call the update text area function to initialize the text area
updateChartDataText();

// Define function to update the text area
function updateChartDataText() {
  const data = chart.data.datasets[0].data;
  const output = data.slice(1).map((point, index) => ({
    duration: point.x - data[index].x,
    speed: point.y,
  }));
  document.getElementById("chartData").value = JSON.stringify(output);
}

// Define function to keep the first element level with the second
export function updateFirstElement() {
  const data = chart.data.datasets[0].data;
  data[0].y = data[1].y;
  updateChartDataText();
  updateTextareaSize();
}

const chartDataTextarea = document.getElementById("chartData");

function updateTextareaSize() {
  chartDataTextarea.style.height = "auto";
  chartDataTextarea.style.height = chartDataTextarea.scrollHeight + 5 + "px";
}

chartDataTextarea.addEventListener("input", updateTextareaSize);

// Update the textarea size initially
updateTextareaSize();

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
  updateFirstElement();
  chart.update();
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
    updateFirstElement();
    chart.update();
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