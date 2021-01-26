import { Availability } from "~/entity/Availability";
import { Staff } from "~/entity/Staff";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

export class AvailabilityControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IAvailabilityController {
    switch (role) {
      case RoleEnum.TA:
        return new TaAvailabilityController();
      case RoleEnum.LECTURER:
        return new LecturerAvailabilityController();
      case AppRoleEnum.ADMIN:
        return new AdminAvailabilityController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IAvailabilityController {
  getAllAvailabilities(): any;
  getAvailability(availabilityId: string, me: Staff): any;
  createAvailability(newRecord: Availability, staff: Staff, me: Staff): any;
  updateAvailability(changedAvailability: Availability, me: Staff): any;
  deleteAvailability(availabilityId: string, me: Staff): any;
}

/* TA role authorisation - RESTRICTED ACCESS
 * - getAvailability (only for their availabilities)
 * - createAvailability (only for themselves)
 * - updateAvailability (only for themselves)
 * - deleteAvailability (only for themselves)
 */

class TaAvailabilityController implements IAvailabilityController {
  getAllAvailabilities() {
    return new UnauthorisedAccessedError("TA cannot get all availabilities");
  }

  async getAvailability(availabilityId: string, me: Staff) {
    let availability = await Availability.findOneOrFail({
      id: availabilityId,
    });
    if (me == availability.staff) {
      return availability;
    } else {
      return new UnauthorisedAccessedError(
        "Can't get availability for staff other than yourself"
      );
    }
  }

  async createAvailability(newRecord: Availability, staff: Staff, me: Staff) {
    if (me == staff) {
      newRecord.staff = staff;
      return Availability.save(Availability.create(newRecord));
    } else {
      return new UnauthorisedAccessedError(
        "Can't create availability for staff other than yourself"
      );
    }
  }

  async updateAvailability(changedAvailability: Availability, me: Staff) {
    if (me == changedAvailability.staff) {
      let availabilityToUpdate = await Availability.findOne({
        id: changedAvailability.id,
      });
      availabilityToUpdate = changedAvailability;
      return Availability.save(availabilityToUpdate);
    } else {
      return new UnauthorisedAccessedError(
        "Can't update availability for staff other than yourself"
      );
    }
  }

  async deleteAvailability(availabilityId: string, me: Staff) {
    let staff = (await Availability.findOneOrFail({ id: availabilityId }))
      .staff;
    if (me == staff) {
      return Availability.delete({ id: availabilityId });
    } else {
      return new UnauthorisedAccessedError(
        "Can't delete availability for staff other than yourself"
      );
    }
  }
}

/* Lecturer role authorisation - RESTRICTED ACCESS
 * - getAllAvailabilities
 * - getAvailability (only for themselves)
 * - createAvailability (only for themselves)
 * - updateAvailability (only for themselves)
 * - deleteAvailability (only for themselves)
 */

class LecturerAvailabilityController implements IAvailabilityController {
  getAllAvailabilities() {
    return Availability.find();
  }

  async getAvailability(availabilityId: string, me: Staff) {
    let availability = await Availability.findOneOrFail({
      id: availabilityId,
    });
    if (me == availability.staff) {
      return availability;
    } else {
      return new UnauthorisedAccessedError(
        "Can't get availability for staff other than yourself"
      );
    }
  }

  async createAvailability(newRecord: Availability, staff: Staff, me: Staff) {
    if (me == staff) {
      newRecord.staff = staff;
      return Availability.save(Availability.create(newRecord));
    } else {
      return new UnauthorisedAccessedError(
        "Can't create availability for staff other than yourself"
      );
    }
  }

  async updateAvailability(changedAvailability: Availability, me: Staff) {
    if (me == changedAvailability.staff) {
      let availabilityToUpdate = await Availability.findOne({
        id: changedAvailability.id,
      });
      availabilityToUpdate = changedAvailability;
      return Availability.save(availabilityToUpdate);
    } else {
      return new UnauthorisedAccessedError(
        "Can't update availability for staff other than yourself"
      );
    }
  }

  async deleteAvailability(availabilityId: string, me: Staff) {
    let staff = (await Availability.findOneOrFail({ id: availabilityId }))
      .staff;
    if (me == staff) {
      return Availability.delete({ id: availabilityId });
    } else {
      return new UnauthorisedAccessedError(
        "Can't delete availability for staff other than yourself"
      );
    }
  }
}

/* Admin/workforce role authorisation - FULL ACCESS
 * - getAllAvailabilities
 * - getAvailability
 * - createAvailability
 * - updateAvailability
 * - deleteAvailability
 */

class AdminAvailabilityController implements IAvailabilityController {
  getAllAvailabilities() {
    return Availability.find();
  }

  async getAvailability(availabilityId: string, me: Staff) {
    return Availability.findOneOrFail({
      id: availabilityId,
    });
  }

  async createAvailability(newRecord: Availability, staff: Staff, me: Staff) {
    newRecord.staff = staff;
    return Availability.save(Availability.create(newRecord));
  }

  async updateAvailability(changedAvailability: Availability, me: Staff) {
    let availabilityToUpdate = await Availability.findOne({
      id: changedAvailability.id,
    });
    availabilityToUpdate = changedAvailability;
    return Availability.save(availabilityToUpdate);
  }

  async deleteAvailability(availabilityId: string, me: Staff) {
    return Availability.delete({ id: availabilityId });
  }
}
