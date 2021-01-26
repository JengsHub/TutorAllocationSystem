import { StatusLog } from "~/entity/StatusLog";
import { ActionEnums } from "~/enums/ActionEnum";
import { createCurrentDateAndTime } from "./getDateAndTime";

export function createAndSaveStatusLog(
  allocationId: string,
  action: ActionEnums,
  staffId: string,
  targetStaffId: string | undefined,
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
