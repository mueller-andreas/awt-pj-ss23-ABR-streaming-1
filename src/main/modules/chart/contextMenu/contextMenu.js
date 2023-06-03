import { addDataPoint, deleteDataPoint } from "./addDeletePoints.js";
// Export a function to handle the contextmenu event
export function handleContextMenu(event, chart, contextMenu) {
  // Prevent the default context menu from appearing
  event.preventDefault();

  // Get the position of the canvas element relative to the page
  const canvasRect = chart.canvas.getBoundingClientRect();

  // Get the position of the event relative to the canvas
  const eventX = event.clientX - canvasRect.left;
  const eventY = event.clientY - canvasRect.top;

  // Get the chart area
  const chartArea = chart.chartArea;

  // Check if the right-click occurred within the chart area
  if (
    eventX >= chartArea.left &&
    eventX <= chartArea.right &&
    eventY >= chartArea.top &&
    eventY <= chartArea.bottom
  ) {
    // Get the active elements at the event position
    const activeElements = chart.tooltip.getActiveElements();

    // Check if there is at least one active element
    if (activeElements.length) {
      // Update the context menu content with a delete option
      contextMenu.innerHTML = `<a href="#" id="deleteDataPoint">Delete Data Point</a>`;

      // Add an event listener for the delete option
      document
        .getElementById("deleteDataPoint")
        .addEventListener("click", (event) => {
          // Prevent the link from navigating to a new page
          event.preventDefault();
          // Pass the datasets, labels and active elements arrays to your delete function
          deleteDataPoint(chart, activeElements);
        });
    } else {
      // Get the position of the event relative to the chart scale
      const position = Chart.helpers.getRelativePosition(event, chart);

      // Update the context menu content with an add option
      contextMenu.innerHTML = `<a href="#" id="addDataPoint">Add Data Point</a>`;

      // Add an event listener for the add option
      document
        .getElementById("addDataPoint")
        .addEventListener("click", (event) => {
          // Prevent the link from navigating to a new page
          event.preventDefault();
          // Pass the datasets, labels and position objects to your add function
          addDataPoint(chart, position);
        });
    }

    // Show the context menu at the position of the event
    contextMenu.style.display = "block";
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
  }
}
