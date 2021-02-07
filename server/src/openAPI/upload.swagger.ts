import { unauthorisedAccessed403Res } from "./definition/messageDef.swagger";

export const upload = {
  "/upload/tas": {
    post: {
      tags: ["Upload"],
      summary: "Uploads the TAS csv file to be used by the rest of the system",
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: not allowed
        - Admin: allowed
        `,
      operationId: "uploadTas",
      consumes: ["multipart/form-data"],
      produces: ["application/json"],
      parameters: [
        {
          in: "formData",
          name: "tas",
          description: "TAS output",
          required: true,
          type: "file",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
        },
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/upload/tps": {
    post: {
      tags: ["Upload"],
      summary: "Uploads the TPS csv file to be used by the rest of the system",
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: not allowed
        - Admin: allowed
        `,
      operationId: "uploadTps",
      consumes: ["multipart/form-data"],
      produces: ["application/json"],
      parameters: [
        {
          in: "formData",
          name: "tps",
          description: "Tutor preference system output",
          required: true,
          type: "file",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
        },
        ...unauthorisedAccessed403Res,
      },
    },
  },

  "/upload/allocate": {
    post: {
      tags: ["Upload"],
      summary:
        "Uploads the Allocate+ csv file to be used by the rest of the system",
      description: `
      
        Role authorisation:
        - TA: not allowed
        - Lecturer: not allowed
        - Admin: allowed
        `,
      operationId: "uploadAllocate",
      consumes: ["multipart/form-data"],
      produces: ["application/json"],
      parameters: [
        {
          in: "formData",
          name: "allocate+",
          description: "Allocate+ output",
          required: true,
          type: "file",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
        },
        ...unauthorisedAccessed403Res,
      },
    },
  },
};
