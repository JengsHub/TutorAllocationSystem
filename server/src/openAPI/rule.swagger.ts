import {
  notAuth401Res,
  unauthorisedAccessed403Res,
} from "./definition/messageDef.swagger";
import { ruleDef } from "./definition/ruleDef.swagger";

export const rule = {
  "/rules": {
    get: {
      tags: ["Rule"],
      summary: "Returns a list of the global rules",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: not allowed
      - Admin: allowed
      `,
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
        ...unauthorisedAccessed403Res,
        ...notAuth401Res,
      },
    },

    put: {
      tags: ["Rule"],
      summary: "Updates a global rule",
      description: `

      Role authorisation:
      - TA: not allowed
      - Lecturer: not allowed
      - Admin: allowed   
      `,
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
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/rules/{id}": {
    get: {
      tags: ["Rule"],
      summary: "Returns a rule",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: not allowed
      - Admin: allowed
      `,
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
        ...unauthorisedAccessed403Res,
        ...notAuth401Res,
      },
    },
  },
};
