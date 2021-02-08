import { activityDef } from "./definition/activityDef.swagger";
import { allocationDef } from "./definition/allocationDef.swagger";
import { unauthorisedAccessed403Res } from "./definition/messageDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";

export const unit = {
  "/units": {
    get: {
      tags: ["Unit"],
      summary: "Returns units matching query",
      description: `
      
        Role authorisation:
        - TA: allowed
        - Lecturer: allowed
        - Admin: allowed
        `,
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
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: not allowed
        - Admin: allowed
        `,
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
        ...unauthorisedAccessed403Res,
      },
    },

    patch: {
      tags: ["Unit"],
      summary: "Updates a unit",
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: allowed
        - Admin: allowed
        `,
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
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/units/{id}": {
    get: {
      tags: ["Unit"],
      summary: "Returns a unit",
      description: `
      
        Role authorisation:
        - TA: allowed
        - Lecturer: allowed
        - Admin: allowed
        `,
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
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: not allowed
        - Admin: allowed
        `,
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
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/units/{id}/activities": {
    get: {
      tags: ["Unit"],
      summary: "Get the activities of a unit",
      description: `
      
        Role authorisation:
        - TA: allowed
        - Lecturer: allowed
        - Admin: allowed
        `,
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
      description: `
      
        Role authorisation:
        - TA: allowed
        - Lecturer: allowed
        - Admin: allowed
        `,
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
