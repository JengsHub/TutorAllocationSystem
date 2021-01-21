import { Request, Response } from "express";
import { DeleteResult, getRepository } from "typeorm";
import {
  ContextRequest,
  ContextResponse,
  DELETE,
  GET,
  Path,
  PathParam,
  POST,
  PUT,
} from "typescript-rest";
import { Activity, Allocation, Staff, Unit, Swap } from "~/entity";
import { checkSwapAllocation } from "../helpers/checkConstraints";
import { authCheck } from "~/helpers/auth";

@Path("/swaps")
class SwapsService {
  // factory = new SwapControllerFactory();
  repo = getRepository(Swap);

  @GET
  public getAllSwaps(): Promise<Array<Swap>> {
    return this.repo.find();
  }

  @GET
  @Path(":id")
  public getSwap(@PathParam("id") id: string) {
    return this.repo.findOne(id);
  }
  /**
   * Get a list of activities a user could potentially swap into provided an activity they want to swap out of
   * @param req
   * @param res
   * @param activityId ID of activty they want to swap out of
   */
  @GET
  @Path("/swappable/:activityId")
  public async getSwappableActivites(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @PathParam("activityId") activityId: string
  ) {
    if (!authCheck(req, res)) return;
    const me = req.user as Staff;

    let activity = await getRepository(Activity).findOneOrFail({
      id: activityId,
    });

    let unit = await getRepository(Unit).findOneOrFail({
      id: activity.unitId,
    });

    let allocations = await getRepository(Allocation).find({
      where: {
        staff: me,
      },
      relations: ["activity"],
    });
    allocations = allocations.filter((alc) => alc.activity.unitId === unit.id);
    let myActivities: Activity[] = [];
    allocations.forEach((alc) => myActivities.push(alc.activity));

    let alternateActivities = await getRepository(Activity).find({
      relations: ["allocations"],
      where: {
        unitId: unit.id,
      },
    });

    alternateActivities = alternateActivities.filter((act) => {
      for (let alc of act.allocations) {
        if (alc.staffId == me.id) {
          return false;
        }
        return checkSwapAllocation(me, myActivities, alc.activity);
      }
    });

    console.log("Mine", alternateActivities);
    console.log("Alts", myActivities);

    return [alternateActivities, myActivities];
  }

  @GET
  @Path("/openSwaps/:unitId")
  public async getOpenSwaps(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @PathParam("unitId") unitId: string
  ): Promise<Array<Swap>> {
    if (!authCheck(req, res)) return Array<Swap>();
    const me = req.user as Staff;

    let myUnit = await getRepository(Unit).findOneOrFail(unitId);

    let unitSwaps = await this.repo
      .createQueryBuilder("swap")
      .addSelect("swap.desired")
      .innerJoinAndSelect("swap.from", "allocation")
      .innerJoinAndSelect("allocation.activity", "activity")
      .leftJoinAndSelect("swap.desired", "activty")
      .where("allocation.staffId != :staffId", { staffId: me.id })
      .andWhere("activity.unitId = :unitId", { unitId: unitId })
      .getMany();

    console.log(unitSwaps);

    let myActivities = await getRepository(Activity)
      .createQueryBuilder("activity")
      .leftJoin("activity.allocations", "allocation")
      .where("allocation.staffId = :staffId", { staffId: me.id })
      .getMany();
    console.log(myActivities);

    let myUnitActivities = myActivities.filter((act) => act.unitId == unitId);
    console.log(myUnitActivities);

    let eligableSwaps = unitSwaps.filter((swap) => {
      if (myUnitActivities.includes(swap.desired)) return false;

      return checkSwapAllocation(me, myActivities, swap.from.activity);
      // return true;
    });
    console.log(eligableSwaps);
    return eligableSwaps;
  }

  @GET
  @Path("/mine/:unitId")
  public async getMySwaps(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @PathParam("unitId") unitId: string
  ): Promise<Array<Swap>> {
    if (!authCheck(req, res)) return Array<Swap>();
    const me = req.user as Staff;

    let mySwaps = await this.repo
      .createQueryBuilder("swap")
      .addSelect("swap.desired")
      .innerJoinAndSelect("swap.from", "allocation")
      .innerJoinAndSelect("allocation.activity", "activity")
      .leftJoinAndSelect("swap.desired", "activty")
      .where("allocation.staffId = :staffId", { staffId: me.id })
      .where("activity.unitId = :unitId", { unitId: unitId })
      .getMany();

    console.log(mySwaps);

    return mySwaps;
  }

  @POST
  public async createSwap(newRecord: Swap): Promise<void | Swap> {
    let swapFrom = await Allocation.findOneOrFail({
      where: { fromAllocationId: newRecord.fromAllocationId },
    });
    let desired = await Activity.findOneOrFail({
      where: { desiredActivityId: newRecord.desiredActivityId },
    });
    let swapInto = null;
    if (newRecord.intoAllocationId) {
      swapInto = await Allocation.findOneOrFail({
        where: { intoAllocationId: newRecord.intoAllocationId },
      });
    }
    // Require both a swap out and a desired activity to swap into
    if (swapFrom && desired) {
      newRecord.desired = desired;
      newRecord.from = swapFrom;
      if (swapInto) newRecord.into = swapInto;
    } else {
      return;
    }

    return this.repo.save(newRecord);
  }

  @PUT
  public async updateStaff(changedSwap: Swap): Promise<Swap> {
    let staffToUpdate = await this.repo.findOne({
      id: changedSwap.id,
    });
    staffToUpdate = changedSwap;
    return this.repo.save(changedSwap);
  }

  @DELETE
  @Path(":id")
  public deleteSwap(@PathParam("id") id: string): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }
}
