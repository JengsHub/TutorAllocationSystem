import { StatusLog } from "~/entity/StatusLog";
import { ActionEnums } from "~/enums/ActionEnum";
import { createCurrentDateAndTime } from "./getDateAndTime";

export function createAndSaveStatusLog(
  allocationId: string,
  action: ActionEnums,
  staffId: string
) {
  let statusLogObj = StatusLog.create({
    allocationId: allocationId,
    staffId: staffId,
    action: action,
    time: createCurrentDateAndTime(),
  });

  StatusLog.save(statusLogObj);
}
