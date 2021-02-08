import {
  notAuth401Res,
  unauthorisedAccessed403Res,
} from "./definition/messageDef.swagger";
import { staffDef } from "./definition/staffDef.swagger";
import { staffpreferenceDef } from "./definition/staffPreferenceDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";

export const staffPreference = {
  "/staffpreferences": {
    get: {
      tags: ["Staff Preference"],
      summary: "Returns a list of staffPreferences",
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: not allowed
        - Admin: allowed
        `,
      operationId: "getAllStaffPreferences",
      produces: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "staffId",
          description: "Staff id",
          required: false,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...staffpreferenceDef,
                unit: unitDef,
              },
            },
          },
        },
        ...unauthorisedAccessed403Res,
      },
    },

    post: {
      tags: ["Staff Preference"],
      summary: "Creates a staffPreference",
      description: `
      
        Role authorisation:
        - TA: can only create preferences for themselves
        - Lecturer: can only create preferences for themselves
        - Admin: can create any staff preference
        `,
      operationId: "createStaffPreference",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "newRecord",
          description: "New StaffPreference object",
          required: true,
          schema: staffpreferenceDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: staffpreferenceDef,
        },
        ...unauthorisedAccessed403Res,
      },
    },

    put: {
      tags: ["Staff Preference"],
      summary: "Updates a staffPreference",
      description: `
      
      Role authorisation:
      - TA: can only update preferences for themselves
      - Lecturer: can only update preferences for themselves
      - Admin: can update any staff preference
      `,
      operationId: "updateStaffPreference",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "changedStaffPreference",
          description: "Updated staffPreference object",
          required: true,
          schema: staffpreferenceDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: staffpreferenceDef,
        },
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/staffpreferences/{id}": {
    get: {
      tags: ["Staff Preference"],
      summary: "Returns a staffPreference",
      description: `
      
        Role authorisation:
        - TA: allowed
        - Lecturer: allowed
        - Admin: allowed
        `,
      operationId: "getStaffPreference",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "StaffPreference id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "object",
            properties: {
              ...staffpreferenceDef.properties,
              staff: staffDef,
              unit: unitDef,
            },
          },
        },
      },
    },

    delete: {
      tags: ["Staff Preference"],
      summary: "Deletes a staffPreference",
      description: `
      
      Role authorisation:
      - TA: can only delete preferences for themselves
      - Lecturer: can only delete preferences for themselves
      - Admin: can delete any staff preference
      `,
      operationId: "deleteStaffPreference",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "StaffPreference id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: staffpreferenceDef,
        },
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/staffpreferences/mine": {
    get: {
      tags: ["Staff Preference"],
      summary: "Return the staff perferences for a current user.",
      operationId: "getMyPreference",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...staffpreferenceDef.properties,
                staff: staffDef,
                unit: unitDef,
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },
  },
};
