/* eslint-disable no-param-reassign */
import Cursor from './Cursor.js';

// Define function to keep the first element level with the second
function updateFirstElement(chart) {
  const { data } = chart.data.datasets[0];
  data[0].y = data[1].y;
}

export function formatJSONText(target, errors) {
  let text = target.innerText;
  if (errors === undefined) {
    errors = [];
  }
  if (errors.length > 0) {
    if (errors[0] !== -1) {
      text = `${text.slice(0, errors[0])}<span class="error">${text[errors[0]]}</span>${text.slice(errors[0] + 1)}`;
    }
  }
  const res = text
    .replaceAll('duration', '<span class="key">duration</span>')
    .replaceAll('speed', '<span class="key">speed</span>')
    .replace(/\d+/g, '<span class="value">$&</span>');
  target.innerHTML = res;
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

function updateTextareaSize() {
  chartDataTextarea.style.height = 'auto';
  chartDataTextarea.style.height = `${chartDataTextarea.scrollHeight + 5}px`;
}

chartDataTextarea.addEventListener('input', updateTextareaSize);
// Define function to update necessary functions
export function updateDataAndUI(chart) {
  // Update the first element
  updateFirstElement(chart);
  // Update the text area with the chart data
  updateChartDataText(chart);
  // Adjust the text area size according to the content
  updateTextareaSize();
}

function checkText(text) {
  const errors = [];
  // test general pattern
  const pattern = /^\[\{\s*"duration"\s*:[1-9]\d*,\s*"speed"\s*:[1-9]\d*\}(,\{\s*"duration"\s*:[1-9]\d*,\s*"speed"\s*:[1-9]\d*\})*\]$/;
  const result = pattern.test(text);
  if (result) {
    return errors;
  }

  // check for correct start and end
  if (!text.startsWith('[{')) {
    errors.push(0);
  }

  if (!text.endsWith('}]')) {
    errors.push(text.length - 2);
  }

  // use json parser error to get error position
  try {
    JSON.parse(text);
  } catch (err) {
    const matches = err.message.matchAll(/at position ([1-9]\d*)/g);
    Array.from(matches).forEach((match) => {
      errors.push(match.index);
    });
  }

  return errors.length > 0 ? errors : [-1];
}

function insertTextSegment(textarea, includeComma) {
  const caret = Cursor.getCurrentCursorPosition(textarea);
  const text = textarea.innerText;
  const result = `${text.slice(0, caret)}"duration":,"speed":}${includeComma ? ',' : ''}${text.slice(caret)}`;
  textarea.innerText = result;
  formatJSONText(textarea, []);
  Cursor.setCurrentCursorPosition(caret + 11, textarea);
}

export function updateChartFromText(event, chart, saveChartData) {
  const origin = event.target;
  const text = origin.innerText;

  if (event.data === '{') {
    if ((text[Cursor.getCurrentCursorPosition(origin) - 2] === ',' || text[Cursor.getCurrentCursorPosition(origin) - 2] === '[') && text[Cursor.getCurrentCursorPosition(origin)] === '{') {
      insertTextSegment(origin, true);
    } else if (text[Cursor.getCurrentCursorPosition(origin)] === ']') {
      insertTextSegment(origin, false);
    }
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
