import { activity } from "./activity.swagger";
import { allocation } from "./allocation.swagger";
import { auth } from "./auth.swagger";
import { availability } from "./availability.swagger";
import { activityDef } from "./definition/activityDef.swagger";
import { allocationDef } from "./definition/allocationDef.swagger";
import { availabilityDef } from "./definition/availabilityDef.swagger";
import { roleDef } from "./definition/roleDef.swagger";
import { ruleDef } from "./definition/ruleDef.swagger";
import { staffDef } from "./definition/staffDef.swagger";
import { staffpreferenceDef } from "./definition/staffPreferenceDef.swagger";
import { statusLogDef } from "./definition/statusLogDef.swagger";
import { swapDef } from "./definition/swapDef.swagger";
import { unitDef } from "./definition/unitDef.swagger";
import { role } from "./role.swagger";
import { rule } from "./rule.swagger";
import { staff } from "./staff.swagger";
import { staffPreference } from "./staffPreference.swagger";
import { statusLog } from "./statusLog.swagger";
import { swap } from "./swap.swagger";
import { unit } from "./unit.swagger";
import { upload } from "./upload.swagger";

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
