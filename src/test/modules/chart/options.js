const scales = {
  x: {
    type: "linear",
    title: {
      display: true,
      text: "Duration (ms)",
    },
    min: 0,
    max: 20000,
    ticks: {
      callback: (val, index, ticks) =>
        index === 0 || index === ticks.length - 1 ? null : val,
    },
  },
  y: {
    title: {
      display: true,
      text: "Speed (kbit/s)",
    },
    beginAtZero: true,
    suggestedMax: 15000,
    ticks: {
      callback: (val, index, ticks) =>
        index === 0 || index === ticks.length - 1 ? null : val,
    },
  },
};

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

    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        mode: "xy",
      },
      pan: {
        enabled: false,
        // mode: function () {
        //   if (eventOutsideDataPoint) {
        //     return "xy";
        //   }
        //   return "";
        // },
        // enabled: true,
        // mode: "",
        // scaleMode: "xy",
      },
      limits: {
        y: { min: 0, max: 40000, minRange: 1000 },
        x: { min: 0, max: 40000, minRange: 1000 },
      },
    },
    dragData: {
      dragX: true,
    },
  },

  scales: scales,
};
