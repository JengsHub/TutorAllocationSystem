export const availability = {
  "/availabilities": {
    get: {
      tags: ["Availability"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    post: {
      tags: ["Availability"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    put: {
      tags: ["Availability"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/availabilities/{id}": {
    get: {
      tags: ["Availability"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    delete: {
      tags: ["Availability"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/availabilities/monToFriAvai/{year}": {
    get: {
      tags: ["Availability"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
