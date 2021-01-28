export const roleDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    title: {
      type: "string",
      enum: ["TA", "Lecturer"],
    },
    unitId: {
      type: "string",
      format: "uuid",
    },
    staffId: {
      type: "string",
      format: "uuid",
    },
  },
};
