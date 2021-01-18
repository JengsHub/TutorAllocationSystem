export const staffDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    givenNames: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    aqf: {
      type: "number",
    },
    studyingAqf: {
      type: "number",
    },
    email: {
      uniqueItems: true,
      type: "string",
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
