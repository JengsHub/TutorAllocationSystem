import { DeleteResult, UpdateResult } from "typeorm";
import { Rule, Staff, Unit } from "~/entity";
import { Role } from "~/entity/Role";
import { AppRoleEnum, RoleEnum } from "~/enums/RoleEnum";
import { UnauthorisedAccessedError } from "~/helpers/shortcuts";

export class RuleControllerFactory {
  getController(role: RoleEnum | AppRoleEnum): IRuleController {
    switch (role) {
      case RoleEnum.TA:
        return new TaRuleController();
      case RoleEnum.LECTURER:
        return new LecturerRuleController();
      case AppRoleEnum.ADMIN:
        return new AdminRuleController();
      default:
        throw new Error("Cannot create controller: invalid Role");
    }
  }
}

export interface IRuleController {
  getAllRules(): any;
  getRule(id: string): any;
  updateRules(changedRules: Rule[]): any;
}

/* TA role authorisation - NO ACCESS
 */

class TaRuleController implements IRuleController {
  getAllRules() {
    return new UnauthorisedAccessedError("TAs cannot get all rules");
  }

  getRule(id: string) {
    return new UnauthorisedAccessedError("TAs cannot get rules");
  }

  async updateRules(changedRules: Rule[]) {
    return new UnauthorisedAccessedError("TAs cannot update rules");
  }
}

/* Lecturer role authorisation - NO ACCESS
 */

class LecturerRuleController implements IRuleController {
  getAllRules() {
    return new UnauthorisedAccessedError("Lecturers cannot get all rules");
  }

  getRule(id: string) {
    return new UnauthorisedAccessedError("Lecturers cannot get rules");
  }

  async updateRules(changedRules: Rule[]) {
    return new UnauthorisedAccessedError("Lecturers cannot update rules");
  }
}

/* Admin/workforce role authorisation - FULL ACCESS
 * - getAllRules
 * - getRule
 * - updateRules
 */
class AdminRuleController implements IRuleController {
  getAllRules() {
    return Rule.find();
  }

  getRule(id: string) {
    return Rule.findOne({
      id: id,
    });
  }

  async updateRules(changedRules: Rule[]) {
    let updatedRules = [];
    for (let changedRule of changedRules) {
      let ruleToUpdate = await Rule.findOne({
        id: changedRule.id,
      });
      ruleToUpdate = changedRule;
      updatedRules.push(ruleToUpdate);
    }
    return Rule.save(updatedRules);
  }
}
