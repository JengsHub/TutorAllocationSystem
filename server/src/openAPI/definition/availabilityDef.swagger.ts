export const availabilityDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    day: {
      type: "string",
      enum: ["M", "T", "W", "Th", "F"],
    },
    starttime: {
      type: "string",
      format: "time",
    },
    endTime: {
      type: "string",
      format: "time",
    },
    year: {
      type: "integer",
    },
    maxHours: {
      type: "integer",
    },
    maxNumberActivities: {
      type: "integer",
    },
    staffId: {
      type: "string",
      format: "uuid",
    },
  },
};
