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
  updateApproval(user: Staff, record: Allocation, value: boolean): any;
  updateAcceptance(user: Staff, record: Allocation, value: boolean): any;
}

class TaAllocationController implements IAllocationController {
  updateAcceptance(user: Staff, record: Allocation, value: boolean) {
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
        isAccepted: value,
      }
    );
  }
  updateApproval(user: Staff, record: Allocation, value: boolean) {
    return new UnauthorisedAccessedError("TA cannot approve an Allocation");
  }
  updateAllocation(user: Staff, changedRecord: Allocation) {
    throw new Error("Method not implemented.");
  }
}

class LecturerAllocationController implements IAllocationController {
  updateAcceptance(user: Staff, record: Allocation, value: boolean) {
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
        isAccepted: value,
      }
    );
  }
  async updateApproval(user: Staff, record: Allocation, value: boolean) {
    return Allocation.update({ id: record.id }, { isApproved: value });
  }

  updateAllocation(user: Staff, changedRecord: Allocation) {
    // Only allow Lecturer of that unit to update
    throw new Error("Method not implemented.");
  }
}

class AdminAllocationController implements IAllocationController {
  updateAcceptance(user: Staff, record: Allocation, value: boolean) {
    return Allocation.update(
      {
        id: record.id,
      },
      {
        isAccepted: value,
      }
    );
  }
  updateApproval(user: Staff, record: Allocation, value: boolean) {
    return Allocation.update({ id: record.id }, { isApproved: value });
  }
  updateAllocation(user: Staff, changedRecord: Allocation) {
    // Full access
    Allocation.save(changedRecord);
  }
}
