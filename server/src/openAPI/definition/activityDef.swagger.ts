export const activityDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
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
    dayOfWeek: {
      type: "string",
      enum: ["M", "T", "W", "Th", "F"],
    },
    startTime: {
      type: "string",
      format: "time",
    },
    endTime: {
      type: "string",
      format: "time",
    },
    unitId: {
      type: "string",
      format: "uuid",
    },
    studentCount: {
      type: "integer",
      default: 0,
    },
    allocationMaxNum: {
      type: "integer",
      default: 1,
    },
  },
};
