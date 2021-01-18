export const rule = {
  "/rules": {
    get: {
      tags: ["Rule"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    put: {
      tags: ["Rule"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
  "/rules/{id}": {
    get: {
      tags: ["Rule"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
