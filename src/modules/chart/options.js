import { zoom } from './zoom.js';

const scales = {
  x: {
    type: 'linear',
    title: {
      display: true,
      text: 'Duration (ms)',
    },
    min: 0,
    max: 40000,
    ticks: {
      includeBounds: false,
    },
  },
  y: {
    title: {
      display: true,
      text: 'Speed (kbit/s)',
    },
    beginAtZero: true,
    min: 0,
    max: 16000,
    ticks: {
      includeBounds: false,
    },
  },
};

export const options = {
  plugins: {
    legend: {
      display: false,
    },
    customCanvasBackgroundColor: {
      color: 'white',
    },
    tooltip: {
      callbacks: {
        title() {
          return '';
        },
        label(context) {
          return `ms: ${context.parsed.x}, kbit/s: ${context.parsed.y}`;
        },
      },
    },
    dragData: {
      dragX: true,
    },
    zoom,
  },
  scales,
};
