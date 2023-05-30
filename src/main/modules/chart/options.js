export const options = {
  plugins: {
    customCanvasBackgroundColor: {
      color: "white",
    },
    tooltip: {
      callbacks: {
        title: function () {
          // return custom title
          return "";
        },
        label: function (context) {
          // return custom label
          return "ms: " + context.parsed.x + ", kbit/s: " + context.parsed.y;
        },
      },
    },
    dragData: {
      dragX: true,
    },
  },

  scales: {
    x: {
      type: "linear",
      title: {
        display: true,
        text: "Duration (ms)",
      },
      min: 0,
      max: 20000,
      stepSize: 1,
    },
    y: {
      title: {
        display: true,
        text: "Speed (kbit/s)",
      },
      beginAtZero: true,
      suggestedMax: 15000,
      stepSize: 1,
    },
  },
};
