import {
  notAuth401Res,
  unauthorisedAccessed403Res,
} from "./definition/messageDef.swagger";
import { staffDef } from "./definition/staffDef.swagger";

export const staff = {
  "/staff": {
    get: {
      tags: ["Staff"],
      summary: "Get staff by unit",
      operationId: "getStaffByUnit",
      produces: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "unitCode",
          description: "Unit code",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "offeringPeriod",
          description: "Offering period of unit",
          required: false,
          type: "string",
        },
        {
          in: "query",
          name: "year",
          description: "Offering year of unit",
          required: false,
          type: "number",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: staffDef,
          },
        },
        ...notAuth401Res,
      },
    },

    post: {
      tags: ["Staff"],
      summary: "Creates a staff member",
      description: `
      
      Role authorisation:
      - TA: not allowed
      - Lecturer: not allowed
      - Admin: allowed
      `,
      operationId: "createStaff",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "newRecord",
          description: "New Staff object",
          required: true,
          schema: staffDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: staffDef,
        },
        ...unauthorisedAccessed403Res,
        ...notAuth401Res,
      },
    },

    put: {
      tags: ["Staff"],
      summary: "Updates a staff member",
      description: `
      
      Role authorisation:
      - TA: can only update themselves
      - Lecturer: can only update themselves
      - Admin: can update any staff member
      `,
      operationId: "updateStaff",
      consumes: ["application.json"],
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "newRecord",
          description: "New Staff object",
          required: true,
          schema: staffDef,
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: staffDef,
        },
        ...unauthorisedAccessed403Res,
        ...notAuth401Res,
      },
    },
  },

  "/staff/all": {
    get: {
      tags: ["Staff"],
      summary: "Returns a list of staff",
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: not allowed
        - Admin: allowed
        `,
      operationId: "getAllStaff",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: staffDef,
          },
        },
        ...unauthorisedAccessed403Res,
        ...notAuth401Res,
      },
    },
  },

  "/staff/{id}": {
    get: {
      tags: ["Staff"],
      summary: "Returns a staff member",
      description: `
      
      Role authorisation:
      - TA: allowed
      - Lecturer: allowed
      - Admin: allowed
      `,
      operationId: "getStaff",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Staff id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: staffDef,
        },
        ...notAuth401Res,
      },
    },

    delete: {
      tags: ["Staff"],
      summary: "Deletes a staff member",
      description: `
      
      Role authorisation:
      - TA: can only delete themselves
      - Lecturer: can only delete themselves
      - Admin: can delete any staff member
      `,
      operationId: "deleteStaff",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Staff id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: staffDef,
        },
        ...unauthorisedAccessed403Res,
        ...notAuth401Res,
      },
    },
  },
};
