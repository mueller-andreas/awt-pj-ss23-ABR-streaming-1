/* eslint-disable no-undef */
import { data } from './modules/chart/data.js';
import { options } from './modules/chart/options.js';
import { pluginCanvasBackgroundColor } from './modules/chart/plugins.js';
import {
  onDragStart,
  onDrag,
  onDragEnd,
} from './modules/chart/dragHandlers.js';
import {
  updateDataAndUI,
  updateChartFromText,
  chartTextKeypress,
  formatJSONText,
  highlightCurrentSegment,
  resetHighlight,
} from './modules/chart/functions/updateFunctions.js';
import {
  saveChartData,
  loadChartData,
} from './modules/chart/localStorage/localStorage.js';
import { handleContextMenu } from './modules/chart/contextMenu/contextMenu.js';
import { exportGraphic } from './modules/chart/eximport/graphic.js';
import {
  exportChartData,
  importChartData,
} from './modules/chart/eximport/json.js';
import { zoomToGraph } from './modules/chart/zoom.js';

// chart.js
const chartContext = document.getElementById('myChart').getContext('2d');

// Create the chart
const chart = new Chart(chartContext, {
  type: 'line',
  data,
  options,
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
const contextMenu = document.getElementById('contextMenu');

chart.canvas.addEventListener('contextmenu', (event) => handleContextMenu(event, chart, contextMenu));

chart.canvas.addEventListener('dataChanged', () => {
  updateDataAndUI(chart);
  saveChartData(chart);
});

document.addEventListener('click', () => {
  contextMenu.style.display = 'none';
});

const chartText = document.getElementById('chartData');

chartText.addEventListener('input', (event) => {
  updateChartFromText(event, chart, saveChartData);
});

chartText.addEventListener('click', (event) => {
  highlightCurrentSegment(event, chart, 0);
});

chartText.addEventListener('keydown', (event) => {
  chartTextKeypress(event, chart, false);
});

chartText.addEventListener('keyup', (event) => {
  chartTextKeypress(event, chart, true);
});

chartText.addEventListener('focusout', (event) => {
  resetHighlight(chart);
})

formatJSONText(chartText);

document.querySelector('#copy-button').onclick = () => {
  navigator.clipboard.writeText(document.querySelector('#chartData').innerText);
};

document
  .getElementById('graphicButton')
  .addEventListener('click', () => exportGraphic(chart));

document
  .getElementById('jsonButtonExport')
  .addEventListener('click', () => exportChartData(chart));

document
  .getElementById('zoomGraphButton')
  .addEventListener('click', () => zoomToGraph(chart));


document.getElementById('jsonButtonImport').addEventListener('click', () => {
  importChartData(chart, updateDataAndUI, saveChartData);
});

zoomToGraph(chart);
