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
      borderColor: 'rgb(67, 155, 255)',
      backgroundColor: 'rgba(67, 155, 255, 0.5)',
      stepped: 'after',
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
