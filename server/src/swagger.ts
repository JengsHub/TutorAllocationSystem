import { activity } from "./openAPI/activity.swagger";
import { allocation } from "./openAPI/allocation.swagger";
import { auth } from "./openAPI/auth.swagger";
import { availability } from "./openAPI/availability.swagger";
import { activityDef } from "./openAPI/definition/activityDef.swagger";
import { allocationDef } from "./openAPI/definition/allocationDef.swagger";
import { availabilityDef } from "./openAPI/definition/availabilityDef.swagger";
import { roleDef } from "./openAPI/definition/roleDef.swagger";
import { ruleDef } from "./openAPI/definition/ruleDef.swagger";
import { staffDef } from "./openAPI/definition/staffDef.swagger";
import { staffpreferenceDef } from "./openAPI/definition/staffPreferenceDef.swagger";
import { statusLogDef } from "./openAPI/definition/statusLogDef.swagger";
import { swapDef } from "./openAPI/definition/swapDef.swagger";
import { unitDef } from "./openAPI/definition/unitDef.swagger";
import { role } from "./openAPI/role.swagger";
import { rule } from "./openAPI/rule.swagger";
import { staff } from "./openAPI/staff.swagger";
import { staffPreference } from "./openAPI/staffPreference.swagger";
import { statusLog } from "./openAPI/statusLog.swagger";
import { swap } from "./openAPI/swap.swagger";
import { unit } from "./openAPI/unit.swagger";
import { upload } from "./openAPI/upload.swagger";

export const swaggerDocument = {
  swagger: "2.0",
  info: {
    description:
      " This is the api documentation for the Monash Tutor Allocation System",
    version: "1.0.0",
    title: "Monash Tutor Allocation System",
  },
  tags: [
    {
      name: "Activity",
      description: "Activities of a unit",
    },
    {
      name: "Allocation",
      description: "Allocation of TA to a unit",
    },
    {
      name: "Auth",
      description: "User authentication service",
    },
    {
      name: "Availability",
      description: "Staff availabilities",
    },
    {
      name: "Role",
      description: "Staff role per unit",
    },
    {
      name: "Rule",
      description: "Rules for activity allocations",
    },
    {
      name: "Staff Preference",
      description: "Staff's preference for unit",
    },
    {
      name: "Staff",
      description: "Information about staff",
    },
    {
      name: "Status Log",
      description: "History log for allocations",
    },
    {
      name: "Swap",
      description: "Allocation swap between TA",
    },
    {
      name: "Unit",
      description: "Information about unit",
    },
    {
      name: "Upload",
      description: "Operations for uploading data",
    },
  ],
  schemes: ["http"],
  paths: {
    ...activity,
    ...allocation,
    ...availability,
    ...auth,
    ...role,
    ...rule,
    ...staffPreference,
    ...staff,
    ...statusLog,
    ...swap,
    ...unit,
    ...upload,
  },
  definitions: {
    Activity: activityDef,
    Allocation: allocationDef,
    Availability: availabilityDef,
    Role: roleDef,
    Rule: ruleDef,
    Staff: staffDef,
    StaffPreference: staffpreferenceDef,
    StatusLog: statusLogDef,
    Swap: swapDef,
    Unit: unitDef,
  },
  securitySchemes: {
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "sid",
    },
  },
};
