import { activityDef } from "./definition/activityDef.swagger";
import { allocationDef } from "./definition/allocationDef.swagger";
import { staffDef } from "./definition/staffDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";

export const allocation = {
  "/allocations": {
    post: {
      tags: ["Allocation"],
      summary: "Creates an allocation",
      operationId: "createAllocation",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "body",
          description: "New allocation object",
          required: true,
          schema: allocationDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: allocationDef,
        },
      },
    },

    put: {
      tags: ["Allocation"],
      summary: "Updates an allocation",
      operationId: "updateAllocation",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Updated allocation object",
          required: true,
          schema: allocationDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: allocationDef,
        },
      },
    },
  },

  //different return depending on is it unitId filetered
  "/allocations/mine": {
    get: {
      tags: ["Allocation"],
      summary: "Get the allocated activities of the current user",
      operationId: "getMyAllocation",
      produces: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "unitId",
          description: "Filter allocations with unitId",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "isLecturerApproved",
          description: "Filter allocations with lecturerApproved true or false",
          required: false,
          type: "boolean",
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
                ...allocationDef.properties,
                staff: staffDef,
                unit: unitDef,
                activity: activityDef,
              },
            },
          },
        },
      },
    },
  },

  "/allocations/unswapped": {
    get: {
      tags: ["Allocation"],
      summary: "Get unswapped allocations",
      operationId: "getUnswappedAllocation",
      produces: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "unitId",
          description: "Filter allocations with unitId",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "isLecturerApproved",
          description:
            "Filter allocations with isLecturerApproved true or false",
          required: false,
          type: "boolean",
        },
        {
          in: "query",
          name: "isWorkforceApproved",
          description:
            "Filter allocations with isWorkforceApproved true or false",
          required: false,
          type: "boolean",
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
                ...allocationDef.properties,
                staff: staffDef,
                unit: unitDef,
                activity: activityDef,
              },
            },
          },
        },
      },
    },
  },

  "/allocations/{id}": {
    get: {
      tags: ["Allocation"],
      summary: "Get an allocation with id",
      operationId: "getAllocation",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "allocationID",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: allocationDef,
        },
      },
    },

    delete: {
      tags: ["Allocation"],
      summary: "Delete an allocation with id",
      operationId: "deleteAllocation",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "allocationID",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: allocationDef,
        },
      },
    },
  },

  "/allocations/{id}/lecturer-approval": {
    patch: {
      tags: ["Allocation"],
      summary: "Update lecturer approval status for specified allocation",
      operationId: "updateLecturerApproval",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "allocationID",
          required: true,
          type: "string",
        },
        {
          in: "query",
          name: "value",
          description: "updated value",
          required: true,
          type: "boolean",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: allocationDef,
        },
      },
    },
  },

  "/allocations/{id}/workforce-approval": {
    patch: {
      tags: ["Allocation"],
      summary: "Update acceptance status for the specified allocation",
      operationId: "updateTaAcceptance",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "allocationID",
          required: true,
          type: "string",
        },
        {
          in: "query",
          name: "value",
          description: "updated value",
          required: true,
          type: "boolean",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: allocationDef,
        },
      },
    },
  },

  "/allocations/{id}/ta-acceptance": {
    patch: {
      tags: ["Allocation"],
      summary: "Update workforce approval status for the specified allocation",
      operationId: "updateWorkforceApproval",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "allocationID",
          required: true,
          type: "string",
        },
        {
          in: "query",
          name: "value",
          description: "updated value",
          required: true,
          type: "boolean",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: allocationDef,
        },
      },
    },
  },
};
