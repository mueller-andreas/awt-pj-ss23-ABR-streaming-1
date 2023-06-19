/* eslint-disable no-param-reassign */
import Cursor from './Cursor.js';

// Define function to update necessary functions
export function updateDataAndUI(chart) {
  // Update the first element
  updateFirstElement(chart);
  // Update the text area with the chart data
  updateChartDataText(chart);
  // Adjust the text area size according to the content
  updateTextareaSize();
}

// Define function to keep the first element level with the second
function updateFirstElement(chart) {
  const { data } = chart.data.datasets[0];
  data[0].y = data[1].y;
}

// Define function to update the text area
function updateChartDataText(chart) {
  const { data } = chart.data.datasets[0];
  const output = data.slice(1).map((point, index) => ({
    duration: point.x - data[index].x,
    speed: point.y,
  }));
  const chartText = document.getElementById('chartData');
  chartText.innerText = JSON.stringify(output);
  formatJSONText(chartText);
}

const chartDataTextarea = document.getElementById('chartData');

chartDataTextarea.addEventListener('input', updateTextareaSize);

function updateTextareaSize() {
  chartDataTextarea.style.height = 'auto';
  chartDataTextarea.style.height = `${chartDataTextarea.scrollHeight + 5}px`;
}

export function updateChartFromText(event, chart, saveChartData) {
  const origin = event.target;
  const text = origin.innerText // .replaceAll(' ', '');

  if (event.data === '{' && text[Cursor.getCurrentCursorPosition(origin) - 2] === ',' && (text[Cursor.getCurrentCursorPosition(origin)] === '{' || text[Cursor.getCurrentCursorPosition(origin)] === ']')) {
    insertTextSegment(origin);
  }

  const pattern = /^\[\{\s*"duration"\s*:[1-9]\d*,\s*"speed"\s*:[1-9]\d*\}(,\{\s*"duration"\s*:[1-9]\d*,\s*"speed"\s*:[1-9]\d*\})*\]$/;
  const result = pattern.test(text);
  origin.classList.toggle('invalid', !result);
  const offset = Cursor.getCurrentCursorPosition(origin);

  formatJSONText(origin);
  updateTextareaSize();

  Cursor.setCurrentCursorPosition(offset, origin);
  if (!result) return;

  const newData = JSON.parse(text);

  let sum = 0;
  const res = newData.map((parameter) => {
    sum += parameter.duration;
    return { x: sum, y: parameter.speed };
  });

  // update chart

  chart.data.datasets[0].data = [{ x: 0, y: res[0].y }, ...res];
  chart.update();
  saveChartData(chart);
}

export function formatJSONText(target) {
  const text = target.innerText;
  const res = text
    .replaceAll('duration', '<span class="key">duration</span>')
    .replaceAll('speed', '<span class="key">speed</span>')
    .replace(/\d+/g, '<span class="value">$&</span>');
  target.innerHTML = res;
}

function insertTextSegment(textarea) {
  const carrot = Cursor.getCurrentCursorPosition(textarea);
  const text = textarea.innerText;
  const result = `${text.slice(0, carrot)}"duration":,"speed":},${text.slice(carrot)}`;
  textarea.innerText = result;
  formatJSONText(textarea);
  Cursor.setCurrentCursorPosition(carrot + 11, textarea);
}

function getCurrentSegmentIndex(textarea) {
  const carrot = Cursor.getCurrentCursorPosition(textarea);
  const text = textarea.innerText;
  let currentSegment = -1;
  for (let i = 1; i < carrot; i += 1) {
    if (text[i] === '{') {
      currentSegment += 1;
    }
  }
  return currentSegment;
}

export function highlightCurrentSegment(event) {
  const currentSegment = getCurrentSegmentIndex(event.target);
}

// move to next data point on tab in the textarea
export function tabNavigation(event) {
  const origin = event.target;
  const text = origin.innerText;
  if (event.key !== 'Tab') return;

  event.preventDefault();
  const carrot = Cursor.getCurrentCursorPosition(origin);
  let nextColon = text.indexOf(':', carrot);
  if (nextColon === -1) {
    nextColon = text.indexOf(':');
  }
  Cursor.setCurrentCursorPosition(nextColon + 1, origin);
}
