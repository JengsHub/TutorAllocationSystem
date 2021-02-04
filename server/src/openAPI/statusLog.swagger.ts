import { staffDef } from "./definition/staffDef.swagger";
import { statusLogDef } from "./definition/statusLogDef.swagger";

export const statusLog = {
  "/statuslog": {
    get: {
      tags: ["Status Log"],
      summary: "Gets all the status logs",
      operationId: "getAllStatusLogs",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: statusLogDef,
          },
        },
      },
    },
  },

  "/statuslog/{allocationId}": {
    get: {
      tags: ["Status Log"],
      summary: "Gets all the status log with a particular allocationId",
      operationId: "getStatusLogs",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "allocationId",
          description: "Allocation id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: statusLogDef,
          },
        },
      },
    },
  },

  "/statuslog/{allocationId}/staffs": {
    get: {
      tags: ["Status Log"],
      summary:
        "Get the status logs of an allocation with the staff and target staff objects attached to it",
      operationId: "getStatusLogsWithUsers",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "allocationId",
          description: "Allocation id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...statusLogDef.properties,
                staff: staffDef,
                targetStaff: staffDef,
              },
            },
          },
        },
      },
    },
  },
};
