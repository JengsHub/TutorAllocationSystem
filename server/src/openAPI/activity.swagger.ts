import { activityDef } from "./definition/activityDef.swagger";
import { allocationDef } from "./definition/allocationDef.swagger";
import {
  noAdminAccess401Res,
  notAuth401Res,
} from "./definition/messageDef.swagger";
import { staffDef } from "./definition/staffDef.swagger";
import { staffpreferenceDef } from "./definition/staffPreferenceDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";

let allocationStafff = {
  staff: staffDef.properties,
  ...allocationDef.properties,
};
export const activity = {
  "/activities": {
    get: {
      tags: ["Activity"],
      summary: "Get all activities with corresponding unit and allocations",
      description: "Require Admin role",
      operationId: "getAllActivities",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...activityDef.properties,
                allocations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ...allocationDef.properties,
                      staff: staffDef,
                    },
                  },
                },
                unit: unitDef,
              },
            },
          },
        },
        ...noAdminAccess401Res,
        ...notAuth401Res,
      },
    },

    put: {
      tags: ["Activity"],
      summary: "Update an activity",
      operationId: "updateActivity",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "body",
          description: "Updated activity object",
          required: true,
          schema: activityDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: activityDef,
        },
        ...notAuth401Res,
      },
    },

    post: {
      tags: ["Activity"],
      summary: "Creates an activity",
      operationId: "createActivity",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "body",
          description: "New activity object",
          required: true,
          schema: activityDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: activityDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/activities/all-my-lecturing": {
    get: {
      tags: ["Activity"],
      summary: "Return a list of activities that the user is lecturing",
      operationId: "getAllLecturingActivities",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...activityDef.properties,
                allocations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ...allocationDef.properties,
                      staff: staffDef,
                    },
                  },
                },
                unit: unitDef,
              },
            },
          },
        },
        ...notAuth401Res,
      },
    },
  },

  "/activities/{activityId}": {
    get: {
      tags: ["Activity"],
      summary: "Get activity by activityId",
      description: `Return one activity with corresponding unit and allocations.

        Role authorisation:
        * TA: can get activities if they have the unit id
        * Lecturer: can get activities if they have the unit id
        * Admin: can get all activities always`,
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
          schema: activityDef,
        },
        ...notAuth401Res,
      },
    },

    delete: {
      tags: ["Activity"],
      summary: "Delete an activity",
      description: `
      
        Role authorisation:
        * TA: not allowed
        * Lecturer: can delete activities in units they are lecturing
        * Admin: can delete any activity
      `,
      operationId: "deleteActivity",
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
          schema: activityDef,
        },
        ...notAuth401Res,
      },
    },
  },

  // "/activities/{activityId}/allocation": {
  //   get: {
  //     tags: ["Activity"],
  //     summary: "Get allocations of an activity",
  //     operationId: "getAllocations",
  //     produces: ["application/json"],
  //     parameters: [
  //       {
  //         name: "activityId",
  //         in: "path",
  //         description: "Id of the activity",
  //         required: true,
  //         type: "string",
  //       },
  //     ],
  //     responses: {
  //       "200": {
  //         description: "successful operation",
  //         schema: {
  //           type: "array",
  //           items: allocationDef,
  //         },
  //         ...notAuth401Res,
  //       },
  //     },
  //   },
  // },

  "/activities/{activityId}/allocationsMaxNum": {
    patch: {
      tags: ["Activity"],
      summary: "Updates the max number of allocation for an activity",
      operationId: "updateMaxNumberOfAllocations",
      produces: ["application/json"],
      parameters: [
        {
          name: "activityId",
          in: "path",
          description: "Id of the activity",
          required: true,
          type: "string",
        },
        {
          name: "value",
          in: "query",
          description: "New max number of allocation",
          required: true,
          type: "number",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: activityDef,
        },
        ...notAuth401Res,
      },
    },
  },

  "/activities/{activityId}/candidates": {
    get: {
      tags: ["Activity"],
      summary: "Return the unsorted candidate pool for an activity",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: can get candidates in units they are lecturing
      - Admin: can get candidates always
      `,
      operationId: "getCandidates",
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
          schema: {
            type: "array",
            items: staffpreferenceDef,
          },
          ...notAuth401Res,
        },
        ...notAuth401Res,
      },
    },
  },

  "/activities/{activityId}/candidates/{sortingCriteria}": {
    get: {
      tags: ["Activity"],
      summary: "Returns the sorted candidate pool for an activity",
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: can get sorted candidates in units they are lecturing
        - Admin: can get sorted candidates always
      `,
      operationId: "getSortedCandidates",
      produces: ["application/json"],
      parameters: [
        {
          name: "activityId",
          in: "path",
          description: "Id of the activity",
          required: true,
          type: "string",
        },
        {
          name: "sortingCriteria",
          in: "path",
          description: "Sorting criteria for candidates, lecturer/staff",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: staffpreferenceDef,
          },
        },
        ...notAuth401Res,
      },
    },
  },
};
