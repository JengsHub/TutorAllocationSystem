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
      },
    },

    post: {
      tags: ["Staff"],
      summary: "Creates a staff member",
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
      },
    },

    put: {
      tags: ["Staff"],
      summary: "Updates a staff member",
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
      },
    },
  },

  "/staff/all": {
    get: {
      tags: ["Staff"],
      summary: "Returns a list of staff",
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
      },
    },
  },

  "/staff/{id}": {
    get: {
      tags: ["Staff"],
      summary: "Returns a staff member",
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
      },
    },

    delete: {
      tags: ["Staff"],
      summary: "Deletes a staff member",
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
      },
    },
  },
};
