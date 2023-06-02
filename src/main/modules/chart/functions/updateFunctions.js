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
  const data = chart.data.datasets[0].data;
  data[0].y = data[1].y;
}

// Define function to update the text area
function updateChartDataText(chart) {
  const data = chart.data.datasets[0].data;
  const output = data.slice(1).map((point, index) => ({
    duration: point.x - data[index].x,
    speed: point.y,
  }));
  document.getElementById("chartData").value = JSON.stringify(output);
}

const chartDataTextarea = document.getElementById("chartData");

chartDataTextarea.addEventListener("input", updateTextareaSize);

function updateTextareaSize() {
  chartDataTextarea.style.height = "auto";
  chartDataTextarea.style.height = chartDataTextarea.scrollHeight + 5 + "px";
}

export function updateChartFromText(event) {
  const origin = event.target;
  const text = origin.value.replace(/ /g, '');

  if (event.data == "{") {
    insertTextSegment(origin)
  }

  const pattern = /^\[\{"duration":[1-9]\d*,"speed":[1-9]\d*\}(,\{"duration":[1-9]\d*,"speed":[1-9]\d*\})*]$/
  const result = pattern.test(text)
  origin.classList.toggle("invalid", !result);

  if (!result) return;

  const newData = JSON.parse(text)

  let sum = 0;
  let res = newData.map((parameter) => {
    sum += parameter.duration
    return {x: sum, y: parameter.speed};
  });

  // update chart
  const chart = origin.chart;
  chart.data.datasets[0].data = [{x: 0, y:res[0].y}, ...res];
  chart.update();
}

function insertTextSegment(textarea) {
  var start = textarea.selectionStart;
  var end = textarea.selectionEnd;
  var sel = textarea.value.substring(start, end);
  var finText = textarea.value.substring(0, start) + "\"duration\":,\"speed\":}" + textarea.value.substring(end);
  textarea.value = finText;
  textarea.focus();
  textarea.selectionEnd= end + 11;
}