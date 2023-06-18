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
    y: { min: 0, max: 300000, minRange: 5000 },
    x: { min: 0, max: 40000, minRange: 4000 },
  },
};
