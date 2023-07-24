export function exportGraphic(chart) {
  // Get the chart's base64 image string
  const chartImageURL = chart.toBase64Image();

  // Create a virtual anchor tag
  const downloadLink = document.createElement('a');
  downloadLink.href = chartImageURL;
  downloadLink.download = 'chart.png';

  // Trigger the download
  downloadLink.click();
}
