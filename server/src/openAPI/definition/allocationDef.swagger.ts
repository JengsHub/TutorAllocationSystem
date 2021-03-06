export const allocationDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    activityId: {
      type: "string",
      format: "uuid",
    },
    staffId: {
      type: "string",
      format: "uuid",
    },
    offerExpiryDate: {
      type: "string",
      format: "timestamptz",
    },
    isLecturerApproved: {
      type: "boolean",
      default: null,
    },
    isTaAccepted: {
      type: "boolean",
      default: null,
    },
    isWorkforceApproved: {
      type: "boolean",
      default: null,
    },
  },
};
