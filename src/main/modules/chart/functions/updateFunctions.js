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

function checkText(text) {
  const pattern = /^\[\{\s*"duration"\s*:[1-9]\d*,\s*"speed"\s*:[1-9]\d*\}(,\{\s*"duration"\s*:[1-9]\d*,\s*"speed"\s*:[1-9]\d*\})*\]$/;
  const result = pattern.test(text);
  if (result) {
    return [];
  }

  try {
    const obj = JSON.parse(text);
  } catch (err) {
    const options = err.message.match(/[1-9]\d*/g).map(parseInt);
    return [options[0]];
  }

  return [];
}

export function updateChartFromText(event, chart, saveChartData) {
  const origin = event.target;
  const text = origin.innerText;

  if (event.data === '{' && text[Cursor.getCurrentCursorPosition(origin) - 2] === ',' && (text[Cursor.getCurrentCursorPosition(origin)] === '{' || text[Cursor.getCurrentCursorPosition(origin)] === ']')) {
    insertTextSegment(origin);
  }

  const errors = checkText(text);
  const result = (errors.length === 0);

  origin.classList.toggle('invalid', !result);
  const offset = Cursor.getCurrentCursorPosition(origin);

  formatJSONText(origin, errors);
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

export function formatJSONText(target, errors) {
  let text = target.innerText;
  if (errors === undefined) {
    errors = [];
  }
  if (errors.length > 0) {
    text = `${text.slice(0, errors[0])}<span class="error">${text[errors[0]]}</span>${text.slice(errors[0] + 1)}`;
  }
  const res = text
    .replaceAll('duration', '<span class="key">duration</span>')
    .replaceAll('speed', '<span class="key">speed</span>')
    .replace(/\d+/g, '<span class="value">$&</span>');
  target.innerHTML = res;
}

function insertTextSegment(textarea) {
  const caret = Cursor.getCurrentCursorPosition(textarea);
  const text = textarea.innerText;
  const result = `${text.slice(0, caret)}"duration":,"speed":},${text.slice(caret)}`;
  textarea.innerText = result;
  formatJSONText(textarea, []);
  Cursor.setCurrentCursorPosition(caret + 11, textarea);
}

function getCurrentSegmentIndex(textarea) {
  const caret = Cursor.getCurrentCursorPosition(textarea);
  const text = textarea.innerText;
  let currentSegment = -1;
  for (let i = 1; i < caret; i += 1) {
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
  const caret = Cursor.getCurrentCursorPosition(origin);
  let nextColon = Math.min(text.indexOf(':', caret), text.indexOf('}', caret));
  if (nextColon === -1) {
    nextColon = text.indexOf(':');
  }
  Cursor.setCurrentCursorPosition(nextColon + 1, origin);
}
