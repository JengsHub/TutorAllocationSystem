import { StatusLog } from "~/entity/StatusLog";
import { ActionEnums } from "~/enums/ActionEnum";
import { createCurrentDate } from "./getDate";

export function createAndSaveStatusLog(allocationId: string, action: ActionEnums ,staffId: string){
    let statusLogObj = StatusLog.create({
      allocationId: allocationId,
      staffId: staffId,
      action: action,
      time: createCurrentDate()
    })

    StatusLog.save(statusLogObj);
}
