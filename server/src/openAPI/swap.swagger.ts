export const swap = {
  "/swaps": {
    get: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    post: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    put: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/{id}": {
    get: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    delete: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/acceptSwap": {
    post: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/pending-lecturer": {
    get: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/pending/{unitId}": {
    get: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/mine/{unitId}": {
    get: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/rejectSwap/{id}": {
    delete: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/openSwaps/:unitId": {
    get: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/swappable/{activityId}": {
    get: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/approveSwapLecturer/{id}": {
    patch: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/swaps/approveSwapWorkforce/{id}": {
    patch: {
      tags: ["Swap"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
