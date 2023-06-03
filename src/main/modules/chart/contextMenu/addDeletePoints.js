// Create a custom event object to notify when the data changes
const dataChanged = new CustomEvent("dataChanged");
// Define function to add data point
export function addDataPoint(chart, position) {
  // Get the value of the new data point based on the position of the right-click
  let label = Math.round(chart.scales.x.getValueForPixel(position.x));
  let value = chart.scales.y.getValueForPixel(position.y);

  // round values to nearest multiple of 100
  label = Math.round(label / 100) * 100;
  value = Math.round(value / 100) * 100;

  // Find the index where to insert the new data point
  let index = chart.data.datasets[0].data.findIndex(
    (dataPoint) => dataPoint.x > label
  );

  // @Todo probably not needed anymore
  if (index === -1) {
    // If the label is greater than any existing data point, add it to the end of the array
    console.log("Index == -1");
    index = chart.data.datasets[0].data.length;
  }

  // Insert the new data point into the dataset
  chart.data.datasets[0].data.splice(index, 0, { x: label, y: value });

  // Hide the context menu
  contextMenu.style.display = "none";

  // Dispatch the custom event to notify that the data has changed

  chart.canvas.dispatchEvent(dataChanged);
  chart.update();
}

// Define function to delete data point
export function deleteDataPoint(chart, activeElements) {
  // Get the index of the data point that was right-clicked
  const index = activeElements[0].index;

  // Delete point only if it is not the last data point
  if (index !== chart.data.datasets[0].data.length - 1) {
    // Delete the data point from the chart
    chart.data.datasets[0].data.splice(index, 1);
    chart.data.labels.splice(index, 1);

    // Hide the context menu
    contextMenu.style.display = "none";

    // Dispatch the custom event to notify that the data has changed

    chart.canvas.dispatchEvent(dataChanged);
    chart.update();
  }
}
