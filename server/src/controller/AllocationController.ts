import { Allocation, Staff } from "~/entity";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers";

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

class TaAllocationController implements IAllocationController {
  updateWorkforceApproval(user: Staff, record: Allocation, value: boolean) {
    return new UnauthorisedAccessedError(
      "TA cannot Workforce approve an Allocation"
    );
  }
  deleteAllocation(user: Staff, recordToDelete: Allocation) {
    if (user.id === recordToDelete.staffId && recordToDelete.isTaAccepted) {
      return Allocation.delete({ id: recordToDelete.id });
    }
    return new UnauthorisedAccessedError(
      "TA user cannot delete this Allocation"
    );
  }
  createAllocation(user: Staff, newRecord: Allocation) {
    return new UnauthorisedAccessedError("TA cannot create an Allocation");
  }
  updateTaAcceptance(user: Staff, record: Allocation, value: boolean) {
    if (record.staffId !== user.id) {
      return new UnauthorisedAccessedError(
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
    return new UnauthorisedAccessedError("TA cannot approve an Allocation");
  }
  updateAllocation(user: Staff, changedRecord: Allocation) {
    return new UnauthorisedAccessedError("TA cannot update allocation");
  }
}

class LecturerAllocationController implements IAllocationController {
  updateWorkforceApproval(user: Staff, record: Allocation, value: boolean) {
    return new UnauthorisedAccessedError(
      "Lecturer cannot Workforce approve an Allocation"
    );
  }
  deleteAllocation(user: Staff, recordToDelete: Allocation) {
    if (!recordToDelete.isTaAccepted) {
      return Allocation.delete({ id: recordToDelete.id });
    }
    return new UnauthorisedAccessedError(
      "Lecturer cannot delete this Allocation: Allocation has already been accepted"
    );
  }
  createAllocation(user: Staff, newRecord: Allocation) {
    return Allocation.save(newRecord);
  }
  updateTaAcceptance(user: Staff, record: Allocation, value: boolean) {
    if (record.staffId !== user.id) {
      return new UnauthorisedAccessedError(
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
    // TODO: Only allow Lecturer of that unit to update
    return new UnauthorisedAccessedError("Lecturer cannot update allocation");
  }
}

class AdminAllocationController implements IAllocationController {
  updateWorkforceApproval(user: Staff, record: Allocation, value: boolean) {
    return Allocation.update({ id: record.id }, { isWorkforceApproved: value });
  }
  deleteAllocation(user: Staff, recordToDelete: Allocation) {
    return Allocation.delete({ id: recordToDelete.id });
  }
  createAllocation(user: Staff, newRecord: Allocation) {
    return Allocation.save(newRecord);
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
