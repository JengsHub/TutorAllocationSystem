export const ruleDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    ruleName: {
      readOnly: true,
      type: "string",
    },
    ruleDescription: {
      readOnly: true,
      type: "string",
    },
    value: {
      type: "integer",
    },
  },
};
