import { Activity, Staff, Rule, Availability, Allocation } from "~/entity";
import { getRepository } from "typeorm";

/**
 * Calculate the time duration of the activity
 * @param activity activity to be determined
 */
const activityDuration = (activity: Activity) => {
  var activityStartTime = new Date("1970-1-1 " + activity.startTime);
  var activityEndTime = new Date("1970-1-1  " + activity.endTime);
  return (
    (activityEndTime.valueOf() - activityStartTime.valueOf()) / 1000 / 60 / 60
  );
};

/**
 * Checks if an allocation fits the constraints (global rules as well as individual staff preferences)
 * @param newRecord the new allocation
 * @param staff the staff member taking the allocation
 */
export const checkAllocation = async (
  staff: Staff,
  newActivity: Activity
): Promise<boolean> => {
  // TODO: can be optimised. Add a new table/new columns with triggers that automatically count hours for each day when new allocations are made?

  const allocationsRepo = getRepository(Allocation);

  const currentAllocations = await allocationsRepo.find({
    relations: ["staff", "activity"],
    where: { staff: { id: staff.id } },
  });

  console.log(staff.lastName);

  let dayHours = activityDuration(newActivity);
  let weekHours = activityDuration(newActivity);
  let activitiesInUnit = 1;
  let totalActivities = 1;

  const activities = currentAllocations.map((a) => a.activity);

  // Checking the numbers against the constraints/rules.
  // TODO: Unfortunately, there's a lot of connascence here with the rule names. Is there a better way to do this?
  const rules = await getRepository(Rule);
  const availability = await getRepository(Availability).findOne({
    relations: ["staff"],
    where: { staff: { id: staff.id }, day: newActivity.dayOfWeek },
  });
  if (!availability) return false;

  activities.forEach((activity) => {
    if (activity && newActivity) {
      // Total hours in day
      if (activity.dayOfWeek === newActivity.dayOfWeek)
        dayHours += activityDuration(activity);
      // Total hours in week
      weekHours += activityDuration(activity);
      // Activities in unit
      if (activity.unitId === newActivity.unitId) activitiesInUnit++;
      // Total activities
      totalActivities++;
    }
  });

  const maxHoursPerDayRule = (
    await rules.findOneOrFail({ ruleName: "maxHoursPerDay" })
  ).value;
  const maxHoursPerWeekRule = Math.min(
    (await rules.findOneOrFail({ ruleName: "maxHoursPerWeek" })).value,
    availability.maxHours
  );
  const maxActivitiesPerUnitRule = (
    await rules.findOneOrFail({ ruleName: "maxActivitiesPerUnit" })
  ).value;
  const maxTotalActivitiesRule = Math.min(
    (await rules.findOneOrFail({ ruleName: "maxTotalActivities" })).value,
    availability.maxNumberActivities
  );
  const consecutiveHoursRule = (
    await rules.findOneOrFail({ ruleName: "consecutiveHours" })
  ).value;

  console.log(dayHours, weekHours, activitiesInUnit, totalActivities);

  // TODO: Specific error message for each constraint violated
  if (
    dayHours > maxHoursPerDayRule ||
    weekHours > maxHoursPerWeekRule ||
    activitiesInUnit > maxActivitiesPerUnitRule ||
    totalActivities > maxTotalActivitiesRule
  )
    return false;

  // Check if fits staff member's availability hours
  const isWithinAvailableHours =
    availability.startTime <= newActivity.startTime &&
    availability.endTime >= newActivity.endTime;

  console.log(isWithinAvailableHours);

  if (isWithinAvailableHours) return false;

  // Check for clashes

  const sameDayActivities = activities
    .filter((a) => a?.dayOfWeek === newActivity.dayOfWeek)
    .slice();

  for (let a of sameDayActivities) {
    if (a.startTime < newActivity.endTime || a.endTime > newActivity.startTime)
      return false;
  }

  console.log(sameDayActivities);

  // Check consecutive hours

  let stack: Activity[] = [];
  sameDayActivities.forEach((a) => {
    let lastActivity = stack[stack.length - 1];
    if (!a) return;
    if (!stack.length) {
      stack.push(a);
      return;
    }
    if (a.startTime > lastActivity.endTime) stack.push(a);
    else if (a.endTime > lastActivity.endTime) lastActivity.endTime = a.endTime;
  });
  const longestConsecutive = Math.max(...stack.map((a) => activityDuration(a)));

  console.log(longestConsecutive, longestConsecutive > consecutiveHoursRule);

  if (longestConsecutive > consecutiveHoursRule) return false;

  return true;
};
