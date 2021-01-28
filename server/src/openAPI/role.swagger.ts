export const role = {
  "/roles": {
    get: {
      tags: ["Role"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/roles/{id}": {
    get: {
      tags: ["Role"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/roles/unit/{unitId}": {
    get: {
      tags: ["Role"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    post: {
      tags: ["Role"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    put: {
      tags: ["Role"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/roles/unit/{unitId}/me": {
    get: {
      tags: ["Role"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/roles/unit/{unitId}/{roleId}": {
    delete: {
      tags: ["Role"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
