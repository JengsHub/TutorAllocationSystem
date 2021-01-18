export const ruleDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
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
      type: "number",
    },
  },
};
