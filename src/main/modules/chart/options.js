const scaleOpts = {
  reverse: false,
  ticks: {
    callback: (val, index, ticks) =>
      index === 0 || index === ticks.length - 1 ? null : val,
  },
  grid: {
    borderColor: "rgba( 0, 0, 0, 0.1)",
    color: "rgba( 0, 0, 0, 0.1)",
  },
  title: {
    display: true,
    text: (ctx) => ctx.scale.axis + " axis",
  },
};

const scales = {
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
    dragData: {
      dragX: true,
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        mode: "xy",
      },
      pan: {
        enabled: true,
        mode: "",
        scaleMode: "xy",
      },
      limits: {
        y: { min: 0, max: 20000, minRange: 1000 },
        x: { min: 0, max: 40000, minRange: 1000 },
      },
    },
  },

  scaleOpts: scaleOpts,
  scales: scales,
};

Object.keys(scales).forEach((scale) => Object.assign(scales[scale], scaleOpts));
