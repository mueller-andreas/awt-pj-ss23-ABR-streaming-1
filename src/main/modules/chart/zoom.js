export let eventOutsideDataPoint = true;
export const changeEventOutsideDataPoint = (newIsEventOutside) =>
  (eventOutsideDataPoint = newIsEventOutside);

export const zoom = {
  zoom: {
    wheel: {
      enabled: true,
    },
    mode: "",
    scaleMode: "xy",
  },
  pan: {
    enabled: true,
    // Interrupt pan if the click happened on a data point
    // Fixes the interaction between drag an zoom/pan plugins
    onPanStart: () => {
      if (eventOutsideDataPoint) {
        return true;
      }
      return false;
    },
    mode: "",
    scaleMode: "xy",
    threshold: 10,
  },
  limits: {
    x: { min: 0, max: 1000000, minRange: 4000 },
    y: { min: 0, max: 1000000, minRange: 5000 },
  },
};

export function zoomToGraph(chart) {
  const data = chart.data.datasets[0].data;
  const xMax = Math.max(...data.map((d) => d.x));
  const yMax = Math.max(...data.map((d) => d.y));

  chart.zoomScale("x", { min: 0, max: xMax });
  chart.zoomScale("y", { min: 0, max: yMax });
}
