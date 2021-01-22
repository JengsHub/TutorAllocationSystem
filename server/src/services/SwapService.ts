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

// TODO: implement swap controller for Lecturer Only and Workforce Only end points
// Approving and Pending should be Lec only
// Confirming (todo) and Pending should be WF only
// Confirming should swap the staff members, then archive the swap (or delete)

@Path("/swaps")
class SwapsService {
  // factory = new SwapControllerFactory();
  repo = getRepository(Swap);

  /**
   * Fetch all swap entities
   */
  @GET
  public getAllSwaps(): Promise<Array<Swap>> {
    return this.repo.find();
  }

  /**
   * Fetch swap enity by ID
   * @param id swap entity ID: string
   */
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
      relations: ["allocations", "unit"],
      where: {
        unitId: unit.id,
      },
    });

    alternateActivities = alternateActivities.filter((act) => {
      for (let alc of act.allocations) {
        if (alc.staffId === me.id) {
          return false;
        }
      }
      const eligable = checkSwapAllocation(me, myActivities, act);
      return eligable;
    });

    // console.log("Mine", alternateActivities);
    // console.log("Alts", myActivities);

    return alternateActivities;
  }

  /**
   * Fetch all swaps that are open and do not belong to the user that requested them
   * filters by units the user has an allocation in
   * also filters results via checkConstraints to remove optiosn they can't take
   * @param req
   * @param res
   * @param unitId unity entity id: string
   */
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
      .innerJoinAndSelect("swap.from", "from")
      .leftJoinAndSelect("swap.into", "into")
      .leftJoinAndSelect("from.activity", "activity")
      .leftJoinAndSelect("into.activity", "intoActivity")
      .leftJoinAndSelect("swap.desired", "activty")
      .where("from.staffId != :staffId", { staffId: me.id })
      .andWhere("activity.unitId = :unitId", { unitId: unitId })
      .getMany();

    // console.log(unitSwaps);

    let myActivities = await getRepository(Activity)
      .createQueryBuilder("activity")
      .leftJoin("activity.allocations", "allocation")
      .where("allocation.staffId = :staffId", { staffId: me.id })
      .getMany();
    // console.log(myActivities);

    let myUnitActivities = myActivities.filter((act) => act.unitId == unitId);
    // console.log(myUnitActivities);

    let eligableSwaps = unitSwaps.filter((swap) => {
      if (myUnitActivities.includes(swap.desired)) return false;

      return checkSwapAllocation(me, myActivities, swap.from.activity);
      // return true;
    });
    // console.log(eligableSwaps);
    return eligableSwaps;
  }

  /**
   * fetch all open swaps where the user belongs to the 'from' allocation
   * given a unit
   * @param req
   * @param res
   * @param unitId
   */
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
      .innerJoinAndSelect("swap.from", "from")
      .leftJoinAndSelect("swap.into", "into")
      .innerJoinAndSelect("from.activity", "activity")
      .leftJoinAndSelect("into.activity", "intoActivity")
      .leftJoinAndSelect("swap.desired", "activty")
      .where("from.staffId = :staffId", { staffId: me.id })
      .andWhere("activity.unitId = :unitId", { unitId: unitId })
      .getMany();

    console.log(mySwaps);

    return mySwaps;
  }

  /**
   * Used to fill out Lecturers unique swap page where they can accept or reject swaps isnide their unit
   * TODO: purpose this for use by workforce also, may require extension to fetch more data such as staff
   * @param req
   * @param res
   * @param unitId
   */
  @GET
  @Path("/pending/:unitId")
  public async getPendingSwaps(
    @ContextRequest req: Request,
    @ContextResponse res: Response,
    @PathParam("unitId") unitId: string
  ): Promise<Array<Swap>> {
    let pendingSwaps = await this.repo
      .createQueryBuilder("swap")
      .addSelect("swap.desired")
      .innerJoinAndSelect("swap.from", "from")
      .leftJoinAndSelect("swap.into", "into")
      .innerJoinAndSelect("from.activity", "activity")
      .leftJoinAndSelect("into.activity", "intoActivity")
      .leftJoinAndSelect("swap.desired", "activty")
      .where("activity.unitId = :unitId", { unitId: unitId })
      .andWhere("swap.into IS NOT NULL")
      .getMany();

    return pendingSwaps;
  }

  /**
   * Accept a swap item by finding the appropriate allocation and adding it to the "into" section
   * @param existingSwap swap entity the user wished to accept: Swap
   * @param req
   * @param res
   */
  @POST
  @Path("/acceptSwap")
  public async acceptSwap(
    existingSwap: Swap,
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ): Promise<void | Swap> {
    if (!authCheck(req, res)) return;
    const me = req.user as Staff;
    const newInto = await getRepository(Allocation).findOne({
      where: {
        staff: me,
        activity: existingSwap.desired,
      },
    });

    console.log(newInto);

    if (!newInto) return;

    existingSwap.into = newInto;
    return await this.repo.save(existingSwap);
  }

  /**
   * Lecturer approves a swap two staff members have proposed/accpeted
   * TODO: purpose this for workforce, setting and enacting the swap
   */
  @POST
  @Path("/approveSwap/")
  public async approveSwap(
    toApprove: Swap,
    @ContextRequest req: Request,
    @ContextResponse res: Response
  ): Promise<void | Swap> {
    if (!authCheck(req, res)) return;
    const me = req.user as Staff;
    toApprove.lecturerApproved = true;

    // TODO : Draft of swapping staff members, to be moved to WorkForce at later date?
    // let fromStaff = toApprove.from.staff;
    // let intoStaff = toApprove.into.staff;
    // let from = toApprove.from;
    // let into = toApprove.into;
    // from.staff = intoStaff;
    // from.staffId = intoStaff.id;
    // into.staff = fromStaff;
    // into.staffId = fromStaff.id;

    // let allocationRepo = getRepository(Allocation);
    // await allocationRepo.save(from);
    // await allocationRepo.save(into);

    return await this.repo.save(toApprove);
  }

  /**
   * Create new swap entity
   * @param newRecord Swap entity deep partial
   */
  @POST
  public async createSwap(newRecord: Swap): Promise<void | Swap> {
    let swapFrom = await Allocation.findOneOrFail({
      where: { id: newRecord.fromAllocationId },
    });
    let desired = await Activity.findOneOrFail({
      where: { id: newRecord.desiredActivityId },
    });
    let swapInto = null;
    if (newRecord.intoAllocationId) {
      swapInto = await Allocation.findOneOrFail({
        where: { id: newRecord.intoAllocationId },
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

  /**
   * Update a swap entity
   * @param changedSwap : Swap entity or deep partial to change
   */
  @PUT
  public async updateSwap(changedSwap: Swap): Promise<Swap> {
    let updateSwap = await this.repo.findOne({
      id: changedSwap.id,
    });
    updateSwap = changedSwap;
    return this.repo.save(changedSwap);
  }

  /**
   * Delete swap entity by ID
   * @param id string
   */
  @DELETE
  @Path(":id")
  public deleteSwap(@PathParam("id") id: string): Promise<DeleteResult> {
    return this.repo.delete({
      id: id,
    });
  }
}
