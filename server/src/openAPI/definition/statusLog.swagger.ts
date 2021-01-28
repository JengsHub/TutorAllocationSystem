export const statusLogDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    fromAllocationId: {
      type: "string",
    },
    desiredActivityId: {
      type: "string",
    },
    intoAllocationId: {
      type: "string",
    },
    lecturerApproved: {
      type: "boolean",
    },
    workforceApproved: {
      type: "boolean",
    },
  },
};
