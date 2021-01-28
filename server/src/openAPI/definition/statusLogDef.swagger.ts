export const statusLogDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    allocationId: {
      type: "string",
      format: "uuid",
    },
    staffId: {
      type: "string",
      format: "uuid",
    },
    targetStaffId: {
      type: "string",
      format: "uuid",
      nullable: true,
    },
    action: {
      type: "string",
    },
    time: {
      type: "string",
    },
  },
};
