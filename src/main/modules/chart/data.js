export const data = {
  datasets: [
    {
      label: "Bandwidth Trajectory",
      data: [
        { x: 0, y: 8000 },
        { x: 5000, y: 8000 },
        { x: 10000, y: 1000 },
        { x: 20000, y: 12000 },
      ],
      borderColor: (ctx) => {
        //console.log(ctx);
        return borderStyle(ctx, "rgb(192,75,75)");
      },
      // borderColor: "rgb(67, 155, 255)",
      // backgroundColor: "rgba(67, 155, 255, 0.5)",
      backgroundColor: (ctx) => {
        //console.log(ctx);
        return pointStyle(ctx, "rgba(192,75,75, 0.5)");
      },
      stepped: "after",
      segment: {
        borderColor: (ctx) => segmentStyle(ctx, "rgb(192,75,75)"),
        //backgroundColor: (ctx) => segmentStyle(ctx, "rgb(192,75,75, 0.5)"),
      },
      // Disable the first point
      pointHitRadius: function (context) {
        return context.dataIndex === 0 ? 0 : 1;
      },
      pointRadius: function (context) {
        return context.dataIndex === 0 ? 0 : 3;
      },
    },
  ],
};

const currentSeg = 1;

const segmentStyle = (ctx, value) =>
  ctx.p1DataIndex === currentSeg ? value : undefined;

const borderStyle = (ctx, value) =>
  ctx.dataIndex === currentSeg ? value : "rgb(67, 155, 255)";

const pointStyle = (ctx, value) =>
  ctx.dataIndex === currentSeg ? value : "rgba(67, 155, 255, 0.5)";
