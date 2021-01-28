export const activityDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    activityCode: {
      type: "string",
    },
    activityGroup: {
      type: "string",
    },
    campus: {
      type: "string",
    },
    location: {
      type: "string",
    },
    endTime: {
      type: "string",
    },
    dayOfWeek: {
      type: "string",
      enum: ["M", "T", "W", "Th", "F"],
    },
    startTime: {
      type: "string",
    },
    unitId: {
      type: "string",
    },
    studentCount: {
      type: "number",
    },
    allocationMaxNum: {
      type: "number",
    },
  },
};
