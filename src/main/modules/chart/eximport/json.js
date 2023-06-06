export function exportChartData(chart) {
  const chartData = chart.data.datasets[0].data;
  // Map the x and y properties to speed and duration
  const newData = chartData.slice(1).map((point, index) => ({
    duration: point.x - chartData[index].x,
    speed: point.y,
  }));

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

export function importChartData(chart, updateDataAndUI, saveChartData) {
  const input = document.getElementById("inputFile");

  // Check if a file was selected
  if (!input.files || !input.files[0]) {
    alert("Please select a file to import.");
    return;
  }

  // Create a new FileReader
  const reader = new FileReader();

  // Set the function to be executed when the file is loaded
  reader.onload = () => {
    const newData = JSON.parse(reader.result);

    let sum = 0;
    const res = newData.map((parameter) => {
      sum += parameter.duration;
      return { x: sum, y: parameter.speed };
    });

    // update chart
    chart.data.datasets[0].data = [{ x: 0, y: res[0].y }, ...res];
    chart.update();
    //updateChartDataText();
    updateDataAndUI(chart);
    saveChartData(chart);
  };

  // Read the file as text
  reader.readAsText(input.files[0]);
}
