export function exportChartData(chart) {
  let chartData = chart.data.datasets[0].data;

  // Map the x and y properties to speed and duration
  let newData = chartData.map(function (item) {
    return {
      duration: item.x,
      speed: item.y,
    };
  });

  let jsonData = JSON.stringify(newData);
  downloadFile(jsonData, "chartData.json", "application/json");
}

function downloadFile(data, filename, type) {
  let file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export function importChartData(chart) {
  let input = document.getElementById("inputFile");

  // Check if a file was selected
  if (!input.files || !input.files[0]) {
    alert("Please select a file to import.");
    return;
  }

  // Create a new FileReader
  let reader = new FileReader();

  // Set the function to be executed when the file is loaded
  reader.onload = function () {
    let data = JSON.parse(reader.result);

    // Map the duration and speed properties to x and y
    let newData = data.map(function (item) {
      return {
        x: item.duration,
        y: item.speed,
      };
    });

    chart.data.datasets[0].data = newData;
    chart.update();
    //updateChartDataText();
  };

  // Read the file as text
  reader.readAsText(input.files[0]);
}
