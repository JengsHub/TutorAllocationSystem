import { activityDef } from "./definition/activityDef.swagger";
import { allocationDef } from "./definition/allocationDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";

export const unit = {
  "/units": {
    get: {
      tags: ["Unit"],
      summary: "get all units",
      operationId: "getUnits",
      produces: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "unitCode",
          description: "Unit code",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "offeringPeriod",
          description: "Unit offering period",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "year",
          description: "Unit offering year",
          required: false,
          type: "number",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: unitDef,
          },
        },
      },
    },

    post: {
      tags: ["Unit"],
      summary: "Creates a unit",
      operationId: "createUnit",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "newRecord",
          description: "New unit object",
          required: true,
          schema: unitDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: unitDef,
        },
      },
    },

    patch: {
      tags: ["Unit"],
      summary: "Updates a unit",
      operationId: "updateUnit",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "changeUnit",
          description: "Updated unit object",
          required: true,
          schema: unitDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: unitDef,
        },
      },
    },
  },

  "/units/{id}": {
    get: {
      tags: ["Unit"],
      summary: "Returns a unit",
      operationId: "getUnitById",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Unit id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: unitDef,
        },
      },
    },

    delete: {
      tags: ["Unit"],
      summary: "Deletes a unit",
      operationId: "deleteUnit",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Unit id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: unitDef,
        },
      },
    },
  },

  "/units/{id}/activities": {
    get: {
      tags: ["Unit"],
      summary: "Get the activities of a unit",
      operationId: "getUnitActivities",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Unit id",
          required: true,
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
                ...activityDef.properties,
                allocation: {
                  type: "array",
                  items: allocationDef,
                },
              },
            },
          },
        },
      },
    },
  },

  "/units/byRole/{title}": {
    get: {
      tags: ["Unit"],
      summary:
        "Returns the calling user's units depending on the role specified",
      operationId: "getMyUnitsByRole",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "title",
          description: "Title of the user, TA/Lecturer",
          required: true,
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
                ...unitDef.properties,
                activities: {
                  type: "array",
                  items: activityDef,
                },
              },
            },
          },
        },
      },
    },
  },
};
