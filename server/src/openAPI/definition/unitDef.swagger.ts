export const unitDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    unitCode: {
      type: "string",
    },
    offeringPeriod: {
      type: "string",
    },
    campus: {
      type: "string",
    },
    year: {
      type: "integer",
    },
    aqfTarget: {
      type: "integer",
    },
  },
};
