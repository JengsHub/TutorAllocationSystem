import { Request } from "express";
import { getRepository } from "typeorm";
import { ContextRequest, GET, Path, PathParam, PUT } from "typescript-rest";
import { RuleControllerFactory } from "~/controller/RuleController";
import { Staff } from "~/entity/Staff";
import { Rule } from "../entity/Rule";

@Path("/rules")
class RulesService {
  repo = getRepository(Rule);
  factory = new RuleControllerFactory();

  /**
   * Returns a list of the global rules
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   *
   * @return Array<Rule>: rules list
   */
  @GET
  public async getAllRules(@ContextRequest req: Request): Promise<Array<Rule>> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.getAllRules();
  }

  /**
   * Returns a rule
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   *
   * @param id id for the rule
   * @return Rule single rule
   */
  // TODO: assert return value as Promise<Rule> here
  @GET
  @Path(":id")
  public async getRule(
    @PathParam("id") id: string,
    @ContextRequest req: Request
  ) {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.getRule(id);
  }
  /**
   * Updates a global rule
   *
   * Role authorisation:
   *  - TA: not allowed
   *  - Lecturer: not allowed
   *  - Admin: allowed
   *
   * @param changedRule new Rule object to change existing Rule to
   * @return Rule: changed global rule
   */
  @PUT
  public async updateRules(
    changedRules: Rule[],
    @ContextRequest req: Request
  ): Promise<Rule[]> {
    const me = req.user as Staff;
    const controller = this.factory.getController(await me.getRoleTitle());
    return controller.updateRules(changedRules);
  }
}
