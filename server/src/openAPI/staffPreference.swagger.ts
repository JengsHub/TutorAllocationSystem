import { staffDef } from "./definition/staffDef.swagger";
import { staffpreferenceDef } from "./definition/staffPreferenceDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";

export const staffPreference = {
  "/staffpreferences": {
    get: {
      tags: ["Staff Preference"],
      summary: "Returns a list of staffPreferences",
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
      },
    },

    post: {
      tags: ["Staff Preference"],
      summary: "Creates a staffPreference",
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
      },
    },

    put: {
      tags: ["Staff Preference"],
      summary: "Updates a staffPreference",
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
      },
    },
  },

  "/staffpreferences/{id}": {
    get: {
      tags: ["Staff Preference"],
      summary: "Returns a staffPreference",
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
      },
    },
  },
};
