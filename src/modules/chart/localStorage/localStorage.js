export function saveChartData(chart) {
  const chartData = chart.data.datasets[0].data;
  const chartDataString = JSON.stringify(chartData);
  localStorage.setItem('chartData', chartDataString);
}

export function loadChartData(chart) {
  const chartDataString = localStorage.getItem('chartData');
  if (chartDataString) {
    const chartData = JSON.parse(chartDataString);
    chart.data.datasets[0].data = chartData;
    chart.update();
  }
}
