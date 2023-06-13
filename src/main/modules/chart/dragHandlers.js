import { updateDataAndUI } from "./functions/updateFunctions.js";
import { saveChartData } from "./localStorage/localStorage.js";
import { changeEventOutsideDataPoint } from "./zoom.js";
let oldValue = 0;
export const onDragStart = function (e, datasetIndex, index, value) {
  // Prevent first data point to be dragged
  if (index === 0) {
    return false;
  }
  const chart = this;
  // Initialize code for locked segments
  oldValue = chart.data.datasets[datasetIndex].data[index].x;
  // Disable panning
  changeEventOutsideDataPoint(false);
};

export const onDrag = function (e, datasetIndex, index, value) {
  const chart = this;
  const data = chart.data.datasets[datasetIndex].data;

  // Round x-value
  const roundedX = Math.round(value.x / 100) * 100;

  // update data point with rounded x-value
  data[index].x = roundedX;

  // Round y-value
  const roundedY = Math.round(value.y / 100) * 100;
  // update data point with rounded y-value
  data[index].y = roundedY;

  // Check if the current data point is not the first or last
  if (index > 0 && index < data.length - 1) {
    // Get the previous and next data points
    const prev = data[index - 1].x;
    const next = data[index + 1].x;
    // Limit the x value of the current data point to be between the previous and next data points
    value.x = Math.max(prev, Math.min(next, value.x));
  } else if (index === data.length - 1) {
    const prev = data[index - 1].x;
    value.x = Math.max(prev, value.x);
  }

  // Set difference of oldValue and diffX
  const diffX = data[index].x - oldValue;
  oldValue = data[index].x;

  const checkbox = document.getElementById("lockSegButton");
  if (checkbox.checked) {
    data.map((point, i) => {
      // Only change points after the current index
      if (i > index) {
        // Add diffX to the x value of each point
        point.x += diffX;
      }
      // Return the modified point
      return point;
    });
  }
  updateDataAndUI(chart);
};

export const onDragEnd = function (e, datasetIndex, index, value) {
  const chart = this;
  // Get the data from the dataset
  const data = chart.data.datasets[datasetIndex].data;
  // Check if the current data point is not the first or last
  if (index > 0 && index < data.length - 1) {
    // Get the previous and next data points
    const prevIndex = index - 1;
    const nextIndex = index + 1;
    const prev = data[prevIndex].x;
    const next = data[nextIndex].x;
    // Check if the current data point is at the same x position as one of its neighbors
    if (value.x === prev) {
      // Remove the previous data point
      data.splice(index, 1);
    } else if (value.x === next) {
      // Remove the next data point
      data.splice(nextIndex, 1);
    }
  } else if (index === data.length - 1 && data.length > 2) {
    const prevIndex = index - 1;
    const prev = data[prevIndex].x;
    if (value.x === prev) {
      data.splice(index, 1);
    }
  }

  updateDataAndUI(chart);
  chart.update();
  saveChartData(chart);
  // Enable panning
  changeEventOutsideDataPoint(true);
};

export function isLockedSeg(chart) {}
