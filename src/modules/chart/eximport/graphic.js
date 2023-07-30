export function exportGraphic(chart) {
  const chartImageURL = chart.toBase64Image();

  // Create a virtual anchor tag
  const downloadLink = document.createElement('a');
  downloadLink.href = chartImageURL;
  downloadLink.download = 'chart.png';

  downloadLink.click();
}
