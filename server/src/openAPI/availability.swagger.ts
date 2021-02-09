import { availabilityDef } from "./definition/availabilityDef.swagger";
import {
  notAuth401Res,
  unauthorisedAccessed403Res,
} from "./definition/messageDef.swagger";

export const availability = {
  "/availabilities": {
    get: {
      tags: ["Availability"],
      summary: "Returns a list of availabilities",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: not allowed
      - Admin: can get all availabilities for all staff
      `,
      operationId: "getAllAvailabilities",
      produces: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "staffId",
          description: "Staff Id",
          required: false,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: availabilityDef,
          },
        },
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },

    post: {
      tags: ["Availability"],
      summary: "Creates an availability",
      description: `
      
      Role authorisation:
      - TA: only allowed to create their own availabilities
      - Lecturer: only allowed to create their own availabilities
      - Admin: can create any availability for any staff
      `,
      operationId: "createAvailability",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "newRecord",
          description: "New availability object",
          required: true,
          schema: availabilityDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: availabilityDef,
        },
        ...unauthorisedAccessed403Res,
        ...notAuth401Res,
      },
    },

    put: {
      tags: ["Availability"],
      summary: "Updates an availability",
      description: `
      
      Role authorisation:
      - TA: only allowed to update their own availabilities
      - Lecturer: only allowed to update their own availabilities
      - Admin: can update any availability
      `,
      operationId: "updateAvailability",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "changedAvailability",
          description: "Updated availability object",
          required: true,
          schema: availabilityDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: availabilityDef,
        },
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/availabilities/{id}": {
    get: {
      tags: ["Availability"],
      summary: "Returns an availability",
      description: `
      
      Role authorisation:
      - TA: can get availability only for themselves
      - Lecturer: can get availability only for themselves
      - Admin: can get any availability for any staff
      `,
      operationId: "getAvailability",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Availability Id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: availabilityDef,
        },
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },

    delete: {
      tags: ["Availability"],
      summary: "Deletes an availability",
      description: `
      
      Role authorisation:
      - TA: only allowed to delete their own availabilities
      - Lecturer: only allowed to delete their own availabilities
      - Admin: can delete any availability
      `,
      operationId: "deleteAvailability",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Availability Id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: availabilityDef,
        },
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/availabilities/monToFriAvai/{year}": {
    get: {
      tags: ["Availability"],
      summary:
        "Returns a list of availabilities lists, of staff in order of Monday to Friday",
      operationId: "getYearAvailabilities",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "year",
          description: "Search availabilities with year",
          required: true,
          type: "string",
        },
        {
          in: "query",
          name: "staffId",
          description: "Search availabilities of staff with id = staffId",
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
              M: {
                type: "array",
                items: availabilityDef,
              },
              T: {
                type: "array",
                items: availabilityDef,
              },
              W: {
                type: "array",
                items: availabilityDef,
              },
              Th: {
                type: "array",
                items: availabilityDef,
              },
              F: {
                type: "array",
                items: availabilityDef,
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },
  },
};
