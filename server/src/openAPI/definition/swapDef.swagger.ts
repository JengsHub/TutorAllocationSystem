export const swapDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    fromAllocationId: {
      type: "string",
      format: "uuid",
    },
    desiredActivityId: {
      type: "string",
    },
    intoAllocationId: {
      type: "string",
      format: "uuid",
    },
    lecturerApproved: {
      type: "boolean",
    },
    workforceApproved: {
      type: "boolean",
    },
    desiredId: {
      type: "string",
      format: "uuid",
    },
  },
};
