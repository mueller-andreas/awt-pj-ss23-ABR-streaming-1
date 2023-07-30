import { addDataPoint, deleteDataPoint } from './addDeletePoints.js';
export function handleContextMenu(event, chart, contextMenu) {
  event.preventDefault();

  const canvasRect = chart.canvas.getBoundingClientRect();

  const eventX = event.clientX - canvasRect.left;
  const eventY = event.clientY - canvasRect.top;

  const { chartArea } = chart;

  // Check if the right-click occurred within the chart area
  if (
    eventX >= chartArea.left
    && eventX <= chartArea.right
    && eventY >= chartArea.top
    && eventY <= chartArea.bottom
  ) {
    const activeElements = chart.tooltip.getActiveElements();

    if (activeElements.length) {
      contextMenu.innerHTML = '<a href="#" id=\'deleteDataPoint\'>Delete Data Point</a>';

      // Add an event listener for the delete option
      document
        .getElementById('deleteDataPoint')
        .addEventListener('click', (event) => {
          event.preventDefault();
          deleteDataPoint(chart, activeElements);
        });
    } else {
      // Get the position of the event relative to the chart scale
      const position = Chart.helpers.getRelativePosition(event, chart);

      contextMenu.innerHTML = '<a href="#" id=\'addDataPoint\'>Add Data Point</a>';

      // Add an event listener for the add option
      document
        .getElementById('addDataPoint')
        .addEventListener('click', (event) => {
          event.preventDefault();
          addDataPoint(chart, position);
        });
    }

    // Show the context menu at the position of the event
    contextMenu.style.display = 'block';
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
  }
}
