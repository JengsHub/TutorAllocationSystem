import { availabilityDef } from "./definition/availabilityDef.swagger";

export const availability = {
  "/availabilities": {
    get: {
      tags: ["Availability"],
      summary: "Returns a list of availabilities",
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
      },
    },

    post: {
      tags: ["Availability"],
      summary: "Creates an availability",
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
      },
    },

    put: {
      tags: ["Availability"],
      summary: "Updates an availability",
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
      },
    },
  },

  "/availabilities/{id}": {
    get: {
      tags: ["Availability"],
      summary: "Returns an availability",
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
      },
    },

    delete: {
      tags: ["Availability"],
      summary: "Deletes an availability",
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
      },
    },
  },
};
