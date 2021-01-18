export const allocation = {
  "/allocations": {
    post: {
      tags: ["Allocation"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    put: {
      tags: ["Allocation"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
  "/allocations/mine": {
    get: {
      tags: ["Allocation"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
  "/allocations/{id}": {
    get: {
      tags: ["Allocation"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
    delete: {
      tags: ["Allocation"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
  "/allocations/{id}/lecturer-approval": {
    patch: {
      tags: ["Allocation"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
  "/allocations/{id}/workforce-approval": {
    patch: {
      tags: ["Allocation"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
  "/allocations/{id}/ta-acceptance": {
    patch: {
      tags: ["Allocation"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
