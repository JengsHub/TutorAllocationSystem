import {
  notAuth401Res,
  unauthorisedAccessed403Res,
} from "./definition/messageDef.swagger";
import { roleDef } from "./definition/roleDef.swagger";
import { staffDef } from "./definition/staffDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";

export const role = {
  "/roles": {
    get: {
      tags: ["Role"],
      summary: "Get all roles",
      description: "Require Admin access",
      operationId: "getRoles",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...roleDef.properties,
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

  "/roles/{id}": {
    get: {
      tags: ["Role"],
      summary: "Return a role",
      operationId: "getRoleById",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: roleDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/roles/unit/{unitId}": {
    get: {
      tags: ["Role"],
      summary: "Gets a unit's roles",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: allowed for units they are lecturing in
      - Admin: allowed
      `,
      operationId: "getRolesByUnit",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "unitId",
          description: "Unit Id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: roleDef,
          },
        },
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },

    post: {
      tags: ["Role"],
      summary: "Creates a role record for the unit",
      operationId: "createRole",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: allowed for units they are lecturing in
      - Admin: allowed
      `,
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "newRecord",
          description: "new role object",
          required: true,
          type: "string",
        },
        {
          in: "path",
          name: "unitId",
          description: "Unit Id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: roleDef,
        },
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },

    put: {
      tags: ["Role"],
      summary: "Updates a role record for the unit",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: allowed for units they are lecturing in
      - Admin: allowed      
      `,
      operationId: "updateRole",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "changedRecord",
          description: "updated role object",
          required: true,
          type: "string",
        },
        {
          in: "path",
          name: "unitId",
          description: "Unit Id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: roleDef,
        },
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/roles/unit/{unitId}/me": {
    get: {
      tags: ["Role"],
      summary: "Get role of the user for a unit",
      operationId: "getMyRoleByUnit",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "unitId",
          description: "Unit Id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: roleDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/roles/unit/{unitId}/{roleId}": {
    delete: {
      tags: ["Role"],
      summary: "Deletes a role",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: allowed for units they are lecturing in
      - Admin: allowed
      `,
      operationId: "deleteRole",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "unitId",
          description: "Unit Id",
          required: true,
          type: "string",
        },
        {
          in: "path",
          name: "roleId",
          description: "Role Id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: roleDef,
        },
        ...notAuth401Res,
        ...unauthorisedAccessed403Res,
      },
    },
  },
};
