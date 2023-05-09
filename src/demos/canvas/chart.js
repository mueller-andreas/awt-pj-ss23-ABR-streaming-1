var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// data for the chart
var data = [1, 3, 5, 7, 9];

// draw the stepped line
ctx.beginPath();
ctx.moveTo(50, canvas.height - data[0] * 50 - 50);
for (var i = 1; i < data.length; i++) {
    ctx.lineTo(i * 50 + 50, canvas.height - data[i-1] * 50 - 50);
    ctx.lineTo(i * 50 + 50, canvas.height - data[i] * 50 - 50);
}
ctx.stroke();

// // draw the x and y axis
// ctx.beginPath();
// ctx.moveTo(50, canvas.height - 50);
// ctx.lineTo(canvas.width - 50, canvas.height - 50);
// ctx.lineTo(canvas.width - 50, 50);
// ctx.stroke();

// label the x and y axis
for (var i = 0; i <= 10; i++) {
    ctx.fillText(i.toString(), i * 50 + 45, canvas.height - 25);
    ctx.fillText(i.toString(), 25, canvas.height - i * 50 - 45);
}
