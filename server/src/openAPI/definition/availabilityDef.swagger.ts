export const availabilityDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    day: {
      type: "string",
      enum: ["M", "T", "W", "Th", "F"],
    },
    starttime: {
      type: "string",
    },
    endTime: {
      type: "string",
    },
    year: {
      type: "number",
    },
    maxHours: {
      type: "number",
    },
    maxNumberActivities: {
      type: "number",
    },
    staffId: {
      type: "string",
    },
  },
};
