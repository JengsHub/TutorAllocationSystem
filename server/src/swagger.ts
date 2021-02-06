import { activity } from "./openAPI/activity.swagger";
import { activityDef } from "./openAPI/definition/activityDef.swagger";
import { allocation } from "./openAPI/allocation.swagger";
import { allocationDef } from "./openAPI/definition/allocationDef.swagger";
import { auth } from "./openAPI/auth.swagger";
import { availability } from "./openAPI/availability.swagger";
import { availabilityDef } from "./openAPI/definition/availabilityDef.swagger";
import { role } from "./openAPI/role.swagger";
import { roleDef } from "./openAPI/definition/roleDef.swagger";
import { rule } from "./openAPI/rule.swagger";
import { ruleDef } from "./openAPI/definition/ruleDef.swagger";
import { staff } from "./openAPI/staff.swagger";
import { staffDef } from "./openAPI/definition/staffDef.swagger";
import { staffPreference } from "./openAPI/staffPreference.swagger";
import { staffpreferenceDef } from "./openAPI/definition/staffPreferenceDef.swagger";
import { unit } from "./openAPI/unit.swagger";
import { unitDef } from "./openAPI/definition/unitDef.swagger";
import { upload } from "./openAPI/upload.swagger";
import { statusLog } from "./openAPI/statusLog.swagger";
import { swap } from "./openAPI/swap.swagger";
import { statusLogDef } from "./openAPI/definition/statusLogDef.swagger";
import { swapDef } from "./openAPI/definition/swapDef.swagger";

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
    "/activities": activity["/activities"],
    "/activities/all-my-lecturing": activity["/activities/all-my-lecturing"],
    "/activities/{activityId}": activity["/activities/{activityId}"],
    "/activities/{activityId}/allocation":
      activity["/activities/{activityId}/allocation"],
    "/activities/{activityId}/allocationsMaxNum":
      activity["/activities/{activityId}/allocationsMaxNum"],
    "/activities/{activityId}/candidates":
      activity["/activities/{activityId}/candidates"],
    "/activities/{activityId}/candidates/{sortingCriteria}":
      activity["/activities/{activityId}/candidates/{sortingCriteria}"],

    "/allocations": allocation["/allocations"],
    "/allocations/mine": allocation["/allocations/mine"],
    "/allocations/unswapped": allocation["/allocations/unswapped"],
    "/allocations/{id}": allocation["/allocations/{id}"],
    "allocations/{id}/lecturer-approval":
      allocation["/allocations/{id}/lecturer-approval"],
    "/allocations/{id}/ta-acceptance":
      allocation["/allocations/{id}/ta-acceptance"],
    "/allocations/{id}/workforce-approval":
      allocation["/allocations/{id}/workforce-approval"],

    "/availabilities": availability["/availabilities"],
    "/availabilities/{id}": availability["/availabilities/{id}"],
    "/availabilities/monToFriAvai/{year}":
      availability["/availabilities/monToFriAvai/{year}"],

    "/roles": role["/roles"],
    "/roles/{id}": role["/roles/{id}"],
    "/roles/unit/{unitId}": role["/roles/unit/{unitId}"],
    "/roles/unit/{unitId}/me": role["/roles/unit/{unitId}/me"],
    "/roles/unit/{unitId}/{roleId}": role["/roles/unit/{unitId}/{roleId}"],

    "/rules": rule["/rules"],
    "/rules/{id}": rule["/rules/{id}"],

    "/staffpreferences": staffPreference["/staffpreferences"],
    "/staffpreferences/mine": staffPreference["/staffpreferences/mine"],
    "/staffpreferences/{id}": staffPreference["/staffpreferences/{id}"],

    "/staff": staff["/staff"],
    "/staff/all": staff["/staff/all"],
    "/staff/{id}": staff["/staff/{id}"],

    "/statuslog/": statusLog["/statuslog"],
    "/statuslog/{allocationId}": statusLog["/statuslog/{allocationId}"],
    "/statuslog/{allocationId}/staffs":
      statusLog["/statuslog/{allocationId}/staffs"],

    "/swaps": swap["/swaps"],
    "/swaps/{id}": swap["/swaps/{id}"],
    "/swaps/mine/{unitId}": swap["/swaps/mine/{unitId}"],
    "/swaps/acceptSwap": swap["/swaps/acceptSwap"],
    "/swaps/rejectSwap/{id}": swap["/swaps/rejectSwap/{id}"],
    "/swaps/openSwaps/:unitId": swap["/swaps/openSwaps/:unitId"],
    "/swaps/swappable/{activityId}": swap["/swaps/swappable/{activityId}"],
    "/swaps/pending/{unitId}": swap["/swaps/pending/{unitId}"],
    "/swaps/pending-lecturer": swap["/swaps/pending-lecturer"],
    "/swaps/approveSwapLecturer/{id}": swap["/swaps/approveSwapLecturer/{id}"],
    "/swaps/approveSwapWorkforce/{id}":
      swap["/swaps/approveSwapWorkforce/{id}"],

    "/units": unit["/units"],
    "/units/{id}": unit["/units/{id}"],
    "/units/{id}/activities": unit["/units/{id}/activities"],
    "/units/byRole/{title}": unit["/units/byRole/{title}"],

    "/upload/allocate": upload["/upload/allocate"],
    "/upload/tas": upload["/upload/tas"],
    "/upload/tps": upload["/upload/tps"],
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
