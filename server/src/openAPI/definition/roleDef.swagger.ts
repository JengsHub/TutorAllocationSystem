export const roleDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    title: {
      type: "string",
      enum: ["TA", "Lecturer"],
    },
    unitId: {
      type: "string",
    },
    staffId: {
      type: "string",
    },
  },
};
