import { ruleDef } from "./definition/ruleDef.swagger";

export const rule = {
  "/rules": {
    get: {
      tags: ["Rule"],
      summary: "Returns a list of the global rules",
      operationId: "getAllRules",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: ruleDef,
          },
        },
      },
    },

    put: {
      tags: ["Rule"],
      summary: "Updates a global rule",
      operationId: "updateRules",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "changedRules",
          description: "Updated rule objects",
          required: true,
          schema: {
            type: "array",
            items: ruleDef,
          },
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: ruleDef,
          },
        },
      },
    },
  },

  "/rules/{id}": {
    get: {
      tags: ["Rule"],
      summary: "Returns a rule",
      operationId: "getRule",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "ruleId",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: ruleDef,
        },
      },
    },
  },
};
