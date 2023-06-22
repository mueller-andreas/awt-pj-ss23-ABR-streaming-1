export let eventOutsideDataPoint = true;
export const changeEventOutsideDataPoint = (newIsEventOutside) => {
  eventOutsideDataPoint = newIsEventOutside;
};

export const zoom = {
  zoom: {
    wheel: {
      enabled: true,
    },
    mode: 'xy',
  },
  pan: {
    enabled: true,
    mode() {
      if (eventOutsideDataPoint) {
        return 'xy';
      }
      return '';
    },
    // enabled: true,
    // mode: "",
    // scaleMode: "xy",
  },
  limits: {
    y: { min: 0, max: 40000, minRange: 1000 },
    x: { min: 0, max: 40000, minRange: 1000 },
  },
};
