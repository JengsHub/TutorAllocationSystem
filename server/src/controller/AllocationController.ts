import { Allocation, Staff } from "~/entity";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { ActionEnums } from "../enums/ActionEnum";
import { removeKeys, UnauthorisedAccessedError } from "~/helpers";
import { createAndSaveStatusLog } from "~/helpers/statusLogHelper";

export class AllocationControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IAllocationController {
    switch (role) {
      case RoleEnum.TA:
        return new TaAllocationController();
      case RoleEnum.LECTURER:
        return new LecturerAllocationController();
      case AppRoleEnum.ADMIN:
        return new AdminAllocationController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IAllocationController {
  updateAllocation(user: Staff, changedRecord: Allocation): any;
  createAllocation(user: Staff, newRecord: Allocation): any;
  deleteAllocation(user: Staff, recordToDelete: Allocation): any;
  updateLecturerApproval(user: Staff, record: Allocation, value: boolean): any;
  updateTaAcceptance(user: Staff, record: Allocation, value: boolean): any;
  updateWorkforceApproval(user: Staff, record: Allocation, value: boolean): any;
}

/* TA role authorisation - RESTRICTED ACCESS
 * - deleteAllocation (only for their own allocations)
 * - updateTaAcceptance (only for their own allocations)
 */

class TaAllocationController implements IAllocationController {
  updateWorkforceApproval(user: Staff, record: Allocation, value: boolean) {
    throw new UnauthorisedAccessedError(
      "TA cannot Workforce approve an Allocation"
    );
  }
  deleteAllocation(user: Staff, recordToDelete: Allocation) {
    if (user.id === recordToDelete.staffId && recordToDelete.isTaAccepted) {
      return Allocation.delete({ id: recordToDelete.id });
    }
    throw new UnauthorisedAccessedError(
      "TA user cannot delete this Allocation"
    );
  }
  createAllocation(user: Staff, newRecord: Allocation) {
    throw new UnauthorisedAccessedError("TA cannot create an Allocation");
  }
  updateTaAcceptance(user: Staff, record: Allocation, value: boolean) {
    if (record.staffId !== user.id) {
      throw new UnauthorisedAccessedError(
        "Cannot accept an Allocation that is not assigned to the user"
      );
    }

    return Allocation.update(
      {
        id: record.id,
      },
      {
        isTaAccepted: value,
      }
    );
  }
  updateLecturerApproval(user: Staff, record: Allocation, value: boolean) {
    throw new UnauthorisedAccessedError("TA cannot approve an Allocation");
  }
  updateAllocation(user: Staff, changedRecord: Allocation) {
    throw new UnauthorisedAccessedError("TA cannot update allocation");
  }
}

/* Lecturer role authorisation - RESTRICTED ACCESS
 * - updateAllocation
 * - deleteAllocation (only unaccepted allocations)
 * - updateLecturerApproval
 * - updateTaAcceptance (only for allocations they're responsible for)
 */

class LecturerAllocationController implements IAllocationController {
  restrictedWriteKeys: Array<keyof Allocation> = [
    "isWorkforceApproved",
    "isTaAccepted",
  ];

  updateWorkforceApproval(user: Staff, record: Allocation, value: boolean) {
    throw new UnauthorisedAccessedError(
      "Lecturer cannot Workforce approve an Allocation"
    );
  }
  deleteAllocation(user: Staff, recordToDelete: Allocation) {
    if (!recordToDelete.isTaAccepted) {
      return Allocation.delete({ id: recordToDelete.id });
    }
    throw new UnauthorisedAccessedError(
      "Lecturer cannot delete this Allocation: Allocation has already been accepted"
    );
  }
  async createAllocation(user: Staff, newRecord: Allocation) {
    newRecord.isLecturerApproved = true;
    newRecord = removeKeys(newRecord, this.restrictedWriteKeys);
    let allocation = await Allocation.save(newRecord);
    createAndSaveStatusLog(
      allocation["id"],
      ActionEnums.LECTURER_PROPOSE,
      user.id,
      newRecord.staffId
    );
    return Allocation.save(newRecord);
  }
  updateTaAcceptance(user: Staff, record: Allocation, value: boolean) {
    if (record.staffId !== user.id) {
      throw new UnauthorisedAccessedError(
        "Cannot approve an Allocation that is not assigned to the user"
      );
    }

    return Allocation.update(
      {
        id: record.id,
      },
      {
        isTaAccepted: value,
      }
    );
  }
  async updateLecturerApproval(
    user: Staff,
    record: Allocation,
    value: boolean
  ) {
    return Allocation.update({ id: record.id }, { isLecturerApproved: value });
  }

  updateAllocation(user: Staff, changedRecord: Allocation) {
    Allocation.save(changedRecord);
  }
}

/* Admin/workforce role authorisation - FULL ACCESS
 * - updateAllocation
 * - createAllocation
 * - deleteAllocation
 * - updateLecturerApproval
 * - updateTaAcceptance
 * - updateWorkforceApproval
 */

class AdminAllocationController implements IAllocationController {
  updateWorkforceApproval(user: Staff, record: Allocation, value: boolean) {
    return Allocation.update({ id: record.id }, { isWorkforceApproved: value });
  }
  deleteAllocation(user: Staff, recordToDelete: Allocation) {
    return Allocation.delete({ id: recordToDelete.id });
  }
  async createAllocation(user: Staff, newRecord: Allocation) {
    newRecord.isWorkforceApproved = true;
    let allocation = await Allocation.save(newRecord);
    createAndSaveStatusLog(
      allocation["id"],
      ActionEnums.WORKFORCE_PROPOSE,
      user.id,
      newRecord.staffId
    );
    return allocation;
  }
  updateTaAcceptance(user: Staff, record: Allocation, value: boolean) {
    return Allocation.update(
      {
        id: record.id,
      },
      {
        isTaAccepted: value,
      }
    );
  }
  updateLecturerApproval(user: Staff, record: Allocation, value: boolean) {
    return Allocation.update({ id: record.id }, { isLecturerApproved: value });
  }
  updateAllocation(user: Staff, changedRecord: Allocation) {
    // Full access
    Allocation.save(changedRecord);
  }
}
