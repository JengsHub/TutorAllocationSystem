export const staffDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    givenNames: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    aqf: {
      type: "integer",
    },
    studyingAqf: {
      type: "integer",
    },
    email: {
      uniqueItems: true,
      type: "string",
      format: "text",
    },
    googleId: {
      type: "string",
    },
    appRole: {
      type: "string",
      enum: ["User", "Admin"],
    },
  },
};
