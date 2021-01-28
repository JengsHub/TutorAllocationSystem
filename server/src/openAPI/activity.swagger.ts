export const activity = {
  "/activities": {
    get: {
      tags: ["Activity"],
      summary: "Get all activities with corresponding unit and allocations",
      description: "",
      operationId: "getAllActivities",
      produces: ["application/json"],
      parameters: [],
      responses: {
        "200": {
          description: "successful operation",
        },
        "405": {
          description: "Invalid input",
        },
      },
      security: [
        {
          petstore_auth: ["write:pets", "read:pets"],
        },
      ],
    },

    put: {
      tags: ["Activity"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },

    post: {
      tags: ["Activity"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "activities/all-my-lecturing": {
    get: {
      tags: ["Activity"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/activities/{activityId}": {
    get: {
      tags: ["Activity"],
      summary: "Get activity by activityId",
      description:
        "Return one activity with corresponding unit and allocations",
      operationId: "getActivity",
      produces: ["application/json"],
      parameters: [
        {
          name: "activityId",
          in: "path",
          description: "Id of the activity",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
        },
        "400": {
          description: "Invalid status value",
        },
      },
      security: [
        {
          petstore_auth: ["write:pets", "read:pets"],
        },
      ],
    },

    delete: {
      tags: ["Activity"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/activities/{activityId}/allocation": {
    get: {
      tags: ["Activity"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/activities/{activityId}/allocationsMaxNum": {
    patch: {
      tags: ["Activity"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/activities/{activityId}/candidates": {
    get: {
      tags: ["Activity"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/activities/{activityId}/candidates/{sortingCriteria}": {
    get: {
      tags: ["Activity"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
