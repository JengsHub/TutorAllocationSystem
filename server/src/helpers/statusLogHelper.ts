import { StatusLog } from "~/entity/StatusLog";
import { ActionEnums } from "~/enums/ActionEnum";
import { createCurrentDateAndTime } from "./getDateAndTime";

// Page to help in creation of different kinds of status logs and saving into database if required

/**
 * Creates the default status log and save it into the database
 * @param allocationId id of the allocation
 * @param action action taken within the status log
 * @param staffId id of the staff
 * @param targetStaffId id of the staff that the action is for, usually the TA
 */
export function createAndSaveStatusLog(
  allocationId: string,
  action: ActionEnums,
  staffId: string,
  targetStaffId: string | null
) {
  let statusLogObj = StatusLog.create({
    allocationId: allocationId,
    staffId: staffId,
    targetStaffId: targetStaffId,
    action: action,
    time: createCurrentDateAndTime(),
  });

  StatusLog.save(statusLogObj);
}
