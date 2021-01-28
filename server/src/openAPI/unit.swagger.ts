export const unit = {
  "/units": {
    get: {
      tags: ["Unit"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    post: {
      tags: ["Unit"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    patch: {
      tags: ["Unit"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/units/{id}": {
    get: {
      tags: ["Unit"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    delete: {
      tags: ["Unit"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/units/{id}/activities": {
    get: {
      tags: ["Unit"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/units/byRole/{title}": {
    get: {
      tags: ["Unit"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
