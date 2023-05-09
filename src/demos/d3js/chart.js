const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const xScale = d3.scaleLinear().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom(xScale).ticks(5);
const yAxis = d3.axisLeft(yScale);

// const line = d3
//   .line()
//   .x((d) => xScale(d.duration))
//   .y((d) => yScale(d.speed))
//   .curve(d3.curveStepAfter);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Add x-axis and label
svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis);

svg
  .append("text")
  .attr("class", "x-axis-label")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height - 6)
  .text("Duration (ms)");

// Add y-axis and label
svg.append("g").attr("class", "y-axis").call(yAxis);

svg
  .append("text")
  .attr("class", "y-axis-label")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Speed (kbit/s)");


  const data = [
    { x: xScale(0), y: yScale(0), index: 0 },
    { x: xScale(5000), y: yScale(200), index: 1 },
    { x: xScale(10000), y: yScale(100), index: 2 },
    { x: xScale(15000), y: yScale(300), index: 3 }
  ];
  
  const lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y);
  
  const line = svg.append("path")
    .datum(data)
    .attr("d", lineGenerator)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("fill", "none");
  
// // Draw the line
// const data = [
//   { duration: 1000, speed: 100, index: 0 },
//   { duration: 2000, speed: 200, index: 1 },
//   { duration: 3000, speed: 300, index: 2 },
//   { duration: 4000, speed: 400, index: 3 },
//   { duration: 5000, speed: 500, index: 4 },
// ];

svg
  .append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line);

// Add event listeners to make the line editable
let isDragging = false;
let dragStartIndex;
let dragStartPosition;

svg
  .on("mousedown", function (event) {
    const mousePosition = d3.pointer(event);
    const closestIndex = findClosestIndex(mousePosition);

    if (closestIndex !== -1) {
      isDragging = true;
      dragStartIndex = closestIndex;
      dragStartPosition = data[closestIndex];
    }
  })
  .on("mousemove", function (event) {
    if (isDragging) {
      const mousePosition = d3.pointer(event);
      const { x, y } = getValidPosition(mousePosition);

      const diffX = x - dragStartPosition.x;
      const diffY = y - dragStartPosition.y;

      const newData = data.map((d, i) => {
        if (i === dragStartIndex) {
          return { ...d, x: xScale.invert(x), y: yScale.invert(y) };
        } else {
          return d;
        }
      });

      const stepWidth = xScale(data[1].x) - xScale(data[0].x);

      for (let i = 0; i < newData.length - 1; i++) {
        const distance = Math.abs(xScale(newData[i + 1].x) - xScale(newData[i].x));

        if (distance < stepWidth) {
          if (newData[dragStartIndex].x > newData[dragStartIndex - 1].x) {
            newData[dragStartIndex].x = newData[dragStartIndex - 1].x + stepWidth;
          } else {
            newData[dragStartIndex].x = newData[dragStartIndex - 1].x - stepWidth;
          }
        }
      }

      updateChart(newData);
    }
  })
  .on("mouseup", function (event) {
    if (isDragging) {
      isDragging = false;
    }
  });

