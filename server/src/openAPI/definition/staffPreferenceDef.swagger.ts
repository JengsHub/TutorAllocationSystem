export const staffpreferenceDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    preferenceScore: {
      type: "integer",
    },
    lecturerScore: {
      type: "integer",
    },
    isHeadTutorCandidate: {
      type: "boolean",
    },
    staffId: {
      type: "string",
      format: "uuid",
    },
    unitId: {
      type: "string",
      format: "uuid",
    },
  },
};
