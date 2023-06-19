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
  updateText(chartText);
}

const chartDataTextarea = document.getElementById('chartData');

chartDataTextarea.addEventListener('input', updateTextareaSize);

function updateTextareaSize() {
  chartDataTextarea.style.height = 'auto';
  chartDataTextarea.style.height = `${chartDataTextarea.scrollHeight + 5}px`;
}

export function updateChartFromText(event, chart, saveChartData) {
  const origin = event.target;
  const text = origin.innerText.replaceAll(' ', '');

  if (event.data === '{') {
    insertTextSegment(origin);
  }

  const pattern = /^\[\{"duration":[1-9]\d*,"speed":[1-9]\d*\}(,\{"duration":[1-9]\d*,"speed":[1-9]\d*\})*]$/;
  const result = pattern.test(text);
  console.log(text, result);
  origin.classList.toggle('invalid', !result);
  const offset = Cursor.getCurrentCursorPosition(origin);

  updateText(origin);
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

export function updateText(target) {
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
  updateText(textarea);
  Cursor.setCurrentCursorPosition(carrot + 11, textarea);
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
