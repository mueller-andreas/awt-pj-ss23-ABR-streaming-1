export const data = {
  datasets: [
    {
      label: 'Bandwidth Trajectory',
      data: [
        { x: 0, y: 8000 },
        { x: 5000, y: 8000 },
        { x: 10000, y: 1000 },
        { x: 20000, y: 12000 },
      ],
      stepped: 'after',
      segment: {},
      currentSeg: -1,

      // Disable the first point
      pointHitRadius(context) {
        return context.dataIndex === 0 ? 0 : 1;
      },
      pointRadius(context) {
        return context.dataIndex === 0 ? 0 : 3;
      },
    },
  ],
};

data.datasets[0].borderColor = (ctx) => (ctx.dataIndex === data.datasets[0].currentSeg ? 'rgb(192,75,75)' : 'rgb(67, 155, 255)');
data.datasets[0].backgroundColor = (ctx) => (ctx.dataIndex === data.datasets[0].currentSeg ? 'rgba(192,75,75, 0.5)' : 'rgba(67, 155, 255, 0.5)');
data.datasets[0].segment.borderColor = (ctx) => (ctx.p1DataIndex === data.datasets[0].currentSeg ? 'rgb(255,0,0)' : undefined);
