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
  tabNavigation,
} from "./modules/chart/functions/updateFunctions.js";
import {
  saveChartData,
  loadChartData,
} from "./modules/chart/localStorage/localStorage.js";
import { handleContextMenu } from "./modules/chart/contextMenu/contextMenu.js";
import { exportGraphic } from "./modules/chart/eximport/graphic.js";
import {
  exportChartData,
  importChartData,
} from "./modules/chart/eximport/json.js";

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
chartText.addEventListener("input", (event) => {
  updateChartFromText(event, chart)
});
chartText.addEventListener("keydown", tabNavigation);

// Add an event listener to the export button
document
  .getElementById("graphicButton")
  .addEventListener("click", () => exportGraphic(chart));

// Add an event listener to the json export button
document
  .getElementById("jsonButtonExport")
  .addEventListener("click", () => exportChartData(chart));

// Add an event listener to the json import button
// Use updateDataAndUI as callback function for updating the chart and textfield after import
document.getElementById("jsonButtonImport").addEventListener("click", () => {
  importChartData(chart, updateDataAndUI);
});
