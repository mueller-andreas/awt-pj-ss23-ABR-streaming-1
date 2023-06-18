import { zoom } from "./zoom.js";

const scales = {
  x: {
    type: "linear",
    title: {
      display: true,
      text: "Duration (ms)",
    },
    // min: 0,
    // max: 40000,
    // suggestedMin: 0,
    // suggestedMax: 20000,
    ticks: {
      // count: 8,
      // offset: true,
      // precision: 0,
      includeBounds: false,
      //autoSkip: false,
      //stepSize: 2000,
      // sampleSize: 5,
      // Don't show the max and min value of the data, if it would get rendered
      // callback: (val, index, ticks) => {
      //   console.log(ticks);
      //   console.log(scales.x.ticks.count);
      //   console.log(ticks.length);
      //   if (ticks.length === scales.x.ticks.count) {
      //     // console.log(val);
      //     // console.log(ticks);
      //     return index === 0 || index === ticks.length - 1
      //       ? null
      //       : Math.round(val / 100) * 100;
      //   } else if (ticks.length === scales.x.ticks.count - 1) {
      //     return index === 0 ? null : Math.round(val / 100) * 100;
      //   }
      //   return Math.round(val / 100) * 100;
      // },
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
    dragData: {
      dragX: true,
    },
    zoom: zoom,
  },
  scales: scales,
};
