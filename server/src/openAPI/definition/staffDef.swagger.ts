export const staffDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    givenNames: {
      type: "string",
      nullable: true,
    },
    lastName: {
      type: "string",
      nullable: true,
    },
    aqf: {
      type: "integer",
      nullable: true,
    },
    studyingAqf: {
      type: "integer",
      nullable: true,
    },
    email: {
      uniqueItems: true,
      type: "string",
      format: "text",
    },
    googleId: {
      type: "string",
      nullable: true,
    },
    appRole: {
      type: "string",
      enum: ["User", "Admin"],
    },
  },
};
