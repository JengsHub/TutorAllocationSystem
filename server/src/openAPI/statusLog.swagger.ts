export const statusLog = {
  "/statuslog": {
    get: {
      tags: ["Status Log"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },

  "/statuslog/{allocationId}": {
    get: {
      tags: ["Status Log"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
  "/statuslog/{allocationId}/staffs": {
    get: {
      tags: ["Status Log"],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
