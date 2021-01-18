export const staffpreferenceDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    preferenceScore: {
      type: "number",
    },
    lecturerScore: {
      type: "number",
    },
    isHeadTutorCandidate: {
      type: "boolean",
    },
    staffId: {
      type: "string",
    },
    unitId: {
      type: "string",
    },
  },
};
