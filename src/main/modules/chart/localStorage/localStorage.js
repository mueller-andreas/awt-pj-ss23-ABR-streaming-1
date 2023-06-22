// Define a function to save the chart data to local storage
export function saveChartData(chart) {
  // Get the chart data from the chart object
  let chartData = chart.data.datasets[0].data;
  // Convert the chart data to a JSON string
  let chartDataString = JSON.stringify(chartData);
  // Save the chart data string to local storage with a key of "chartData"
  localStorage.setItem('chartData', chartDataString);
}

// Define a function to load the chart data from local storage
export function loadChartData(chart) {
  // Get the chart data string from local storage with a key of "chartData"
  let chartDataString = localStorage.getItem('chartData');
  // Check if the chart data string exists
  if (chartDataString) {
    // Convert the chart data string to an array of objects
    let chartData = JSON.parse(chartDataString);
    // Update the chart data with the loaded data
    chart.data.datasets[0].data = chartData;
    // Update the chart
    chart.update();
  }
}
