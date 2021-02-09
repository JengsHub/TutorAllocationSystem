import { activityDef } from "./definition/activityDef.swagger";
import { allocationDef } from "./definition/allocationDef.swagger";
import { notAuth401Res } from "./definition/messageDef.swagger";
import { staffDef } from "./definition/staffDef.swagger";
import { swapDef } from "./definition/swapDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";

export const swap = {
  "/swaps": {
    get: {
      tags: ["Swap"],
      summary: "Fetch all swap entities",
      operationId: "getAllSwaps",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...swapDef,
                from: allocationDef,
                into: allocationDef,
                fromActivity: activityDef,
                intoActivity: activityDef,
                staff: staffDef,
                intoStaff: staffDef,
                unit: unitDef,
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },

    post: {
      tags: ["Swap"],
      summary: "Create new swap entity",
      operationId: "createSwapcreateSwap",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "newRecord",
          description: "New swap object",
          required: true,
          schema: swapDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: swapDef,
        },
        ...notAuth401Res,
      },
    },

    put: {
      tags: ["Swap"],
      summary: "Update a swap entity",
      operationId: "updateSwap",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "changedSwap",
          description: "Updated swap object",
          required: true,
          schema: swapDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: swapDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/{id}": {
    get: {
      tags: ["Swap"],
      summary: "Fetch swap enity by ID",
      operationId: "getSwap",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "swap id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: swapDef,
        },
        ...notAuth401Res,
      },
    },

    delete: {
      tags: ["Swap"],
      summary: "Delete swap entity by ID",
      operationId: "deleteSwap",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "swap id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: swapDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/acceptSwap": {
    post: {
      tags: ["Swap"],
      summary:
        'Accept a swap item by finding the appropriate allocation and adding it to the "into" section',
      operationId: "acceptSwap",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "existingSwap",
          description: "swap entity the user wished to accept: Swap",
          required: true,
          schema: swapDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: swapDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/pending-lecturer": {
    get: {
      tags: ["Swap"],
      summary:
        "Get all the pending swaps for units that user is a lecturer for",
      operationId: "getAllPendingSwaps",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...swapDef,
                from: allocationDef,
                into: allocationDef,
                fromActivity: activityDef,
                intoActivity: activityDef,
                staff: staffDef,
                intoStaff: staffDef,
                unit: unitDef,
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/pending/{unitId}": {
    get: {
      tags: ["Swap"],
      summary:
        "Used to fill out Lecturers unique swap page where they can accept or reject swaps isnide their unit",
      operationId: "getPendingSwaps",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "unitId",
          description: "Unit id",
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
                ...swapDef,
                desiredId: { type: "string" },
                from: allocationDef,
                into: allocationDef,
                fromActivity: activityDef,
                intoActivity: activityDef,
                desired: activityDef,
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/mine/{unitId}": {
    get: {
      tags: ["Swap"],
      summary:
        "fetch all open swaps where the user belongs to the 'from' allocation",
      operationId: "getMySwaps",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "unitId",
          description: "Unit id",
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
                ...swapDef,
                desiredId: { type: "string" },
                from: allocationDef,
                into: allocationDef,
                fromActivity: activityDef,
                intoActivity: activityDef,
                desired: activityDef,
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/rejectSwap/{id}": {
    delete: {
      tags: ["Swap"],
      summary:
        "Reject a swap proposal and notify the members of the swap via email",
      operationId: "rejectSwap",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Swap id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: swapDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/openSwaps/:unitId": {
    get: {
      tags: ["Swap"],
      summary:
        "Fetch all swaps that are open and do not belong to the user that requested them",
      operationId: "getOpenSwaps",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "unitId",
          description: "Unit Id",
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
                ...swapDef,
                desiredId: { type: "string" },
                from: allocationDef,
                into: allocationDef,
                fromActivity: activityDef,
                intoActivity: activityDef,
                desired: activityDef,
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/swappable/{activityId}": {
    get: {
      tags: ["Swap"],
      summary:
        "Get a list of activities a user could potentially swap into provided an activity they want to swap out of",
      operationId: "getSwappableActivites",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "activityId",
          description: "Activity Id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: activityDef,
          },
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/approveSwapLecturer/{id}": {
    patch: {
      tags: ["Swap"],
      summary:
        "Lecturer approves a swap two staff members have proposed/accpeted",
      operationId: "approveSwapLecturer",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Swap id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: swapDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/swaps/approveSwapWorkforce/{id}": {
    patch: {
      tags: ["Swap"],
      summary:
        "Workforce approves a swap two staff members have proposed/accpeted",
      operationId: "approveSwapWorkforce",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Swap id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: swapDef,
        },
        ...notAuth401Res,
      },
    },
  },
};
