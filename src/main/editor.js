import { data } from "./modules/chart/data.js";
import { options } from "./modules/chart/options.js";
import { pluginCanvasBackgroundColor } from "./modules/chart/plugins.js";
import {
  onDragStart,
  onDrag,
  onDragEnd,
} from "./modules/chart/dragHandlers.js";
import {
  updateDataAndUI,
  updateChartFromText,
} from "./modules/chart/functions/updateFunctions.js";
import {
  saveChartData,
  loadChartData,
} from "./modules/chart/localStorage/localStorage.js";
import { handleContextMenu } from "./modules/chart/contextMenu/contextMenu.js";
import { exportGraphic } from "./modules/chart/eximport/graphic.js";

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

// // Get the context menu element
const contextMenu = document.getElementById("contextMenu");

// Add an event listener for the contextmenu event
chart.canvas.addEventListener("contextmenu", (event) =>
  handleContextMenu(event, chart, contextMenu)
);

// Add an event listener for the dataChanged event using the imported function and passing the chart object as a parameter
chart.canvas.addEventListener("dataChanged", () => {
  updateDataAndUI(chart);
  saveChartData(chart);
});

// Add event listener for click event on document to hide context menu
document.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

// event listener for changes in the textarea contents
const chartText = document.getElementById("chartData");
chartText.chart = chart;
chartText.addEventListener("input", updateChartFromText);

// Add an event listener to the export button
document
  .getElementById("exportButton")
  .addEventListener("click", () => exportGraphic(chart));
