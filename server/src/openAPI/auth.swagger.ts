import { allocationDef } from "./definition/allocationDef.swagger";
import {
  unauthorisedAccessed403Res,
  notAuth401Res,
} from "./definition/messageDef.swagger";

export const auth = {
  "/auth/google": {
    get: {
      tags: ["Auth"],
      summary: "Login with Google account",
      operationId: "googleLogin",
      consumes: ["application.json"],
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/auth/google/logout": {
    get: {
      tags: ["Auth"],
      summary: "Logout Google account",
      operationId: "googleLogout",
      consumes: ["application.json"],
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/auth/login/success": {
    get: {
      tags: ["Auth"],
      summary: "get logged in user informatioin",
      operationId: "googleLogout",
      consumes: ["application.json"],
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: "true",
              },
              message: {
                type: "string",
                example: "user has successfully authenticated",
              },
              user: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    format: "uuid",
                  },
                  givenNames: {
                    type: "string",
                  },
                  lastName: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                  adminAccess: {
                    type: "boolean",
                  },
                },
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },
  },
};
