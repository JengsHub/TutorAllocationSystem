export const noAdminAccessObjDef = {
  type: "object",
  properties: {
    admin: {
      type: "boolean",
      example: "false",
    },
    message: {
      type: "string",
      example: "user does not have admin privilege",
    },
  },
};

export const noAdminAccess401Res = {
  "401": {
    description: "insufficient authorisation",
    schema: noAdminAccessObjDef,
  },
};

export const notAuth401Res = {
  "401": {
    description: "user has not been authenticated",
    schema: {
      type: "object",
      properties: {
        authenticated: {
          type: "boolean",
          example: "false",
        },
        message: {
          type: "string",
          example: "user has not been authenticated",
        },
      },
    },
  },
};
