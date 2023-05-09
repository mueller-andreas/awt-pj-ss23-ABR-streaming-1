// Set up the chart
const margin = {top: 20, right: 20, bottom: 30, left: 50};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

// Define the line generator
const line = d3.line()
  .x(d => x(d.x))
  .y(d => y(d.y))
  .curve(d3.curveStepBefore);


// Create the SVG element
const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the data
let data = [{x: 0, y: 0}, {x: 1, y: 1}];

// Define the drag behavior
const drag = d3.drag()
    .on("start", function(event, d) {
        d3.select(this).raise().classed("active", true);
    })
    .on("drag", function(event, d) {
        // Update the data and the chart on drag
        d.y = y.invert(event.y);
        d3.select(this).attr("cy", y(d.y));
        updateChart();
    })
    .on("end", function(event, d) {
        d3.select(this).classed("active", false);
    });


// Update the chart
function updateChart() {
    // Set the domains of the scales
    x.domain(d3.extent(data, d => d.x));
    y.domain([0, 1]);

    // Remove any existing elements in the SVG
    svg.selectAll("*").remove();

    // Add the x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the y-axis
    svg.append("g")
        .call(yAxis);

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add the dots and make them draggable
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .style("fill", "blue")
        .style("stroke", "white")
        .style("stroke-width", 2)
        .call(drag);

        
    // Add the circles
    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y)) // set initial cy value from data
        .attr("r", 10)
        .call(drag);

}



// Add a new point
function addPoint() {
    data.push({x: data.length, y: Math.random()});
    updateChart();
}

// Remove the last point
function removePoint() {
    data.pop();
    updateChart();
}

// Save the data
function saveData() {
    const jsonData = JSON.stringify(data.map(d => ({
        duration: 5000,
        speed: d.y * 500
    })));
    console.log(jsonData);
}

// Bind event handlers to buttons
d3.select("#add").on("click", addPoint);

d3.select("#remove").on("click", removePoint);
d3.select("#save").on("click", saveData);

// Update the chart for the first time
updateChart();
