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
    // mode: function () {
    //   if (eventOutsideDataPoint) {
    //     return "xy";
    //   }
    //   return "";
    // },
    mode: "",
    scaleMode: "xy",
    threshold: 10,
    modifierKey: "ctrl",
  },
  limits: {
    y: { min: 0, max: 40000, minRange: 1000 },
    x: { min: 0, max: 40000, minRange: 1000 },
  },
};
