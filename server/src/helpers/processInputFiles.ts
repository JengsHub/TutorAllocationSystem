import {
  Activity,
  Allocation,
  Availability,
  Staff,
  StaffPreference,
  Unit,
} from "~/entity";
import { StatusLog } from "../entity/StatusLog";
import { DayOfWeek } from "../enums/DayOfWeek";
import cleanInputData from "./dataSanitizer";

export class ProcessFileService {
  allocateList: any[] = [[]];

  DOW: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ];

  obtainResult = (results: any) => {
    this.allocateList = results.data;
  };

  /**
   * Processes the TAS object taken from the upload and inserts it into the database
   * @param row TAS object obtain from the upload file
   * @param user current user, to be noted in the status log
   */
  processTasObject = async (row: TasObject, user: Staff) => {
    let unit_object: Unit;
    let staff_object: Staff;
    let activity_object: Activity;

    let unit = Unit.create({
      unitCode: row["unitCode"],
      offeringPeriod: row["offeringPeriod"],
      campus: row["campus"],
      year: 2020, // TODO: optiion to change year
      aqfTarget: 0,
    });

    unit = cleanInputData(unit);

    try {
      unit_object = await Unit.createOrUpdateUnit(unit);
    } catch (err) {
      throw err;
    }

    let studyAqf: number =
      isNaN(Number(row["aqf"])) === true ? 0 : Number(row["aqf"]);

    const staffDetail = Staff.create({
      givenNames: row["givenNames"],
      lastName: row["lastNames"],
      aqf: studyAqf,
      studyingAqf: 0,
      email: row["email"],
    });

    try {
      staff_object = await Staff.createOrUpdateStaff(staffDetail);
    } catch (err) {
      throw err;
    }

    // Lecture pref could have decimals so we might need to modify database type
    let headCandidiate: boolean =
      row["isHeadTutorCandidate"] === 1 ? true : false;

    const staffPreference = StaffPreference.create({
      staffId: staff_object["id"],
      unitId: unit_object["id"],
      preferenceScore: Math.floor(Number(row["preferenceScore"])),
      lecturerScore: Math.floor(Number(row["lecturerScore"])),
      isHeadTutorCandidate: headCandidiate,
    });

    try {
      StaffPreference.createOrUpdateStaffPreference(staffPreference);
    } catch (err) {
      throw err;
    }

    let endTime: string = calculateEndTime(row["startTime"], row["duration"]);
    let dayStr: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const activity = Activity.create({
      activityCode: row["activityCode"],
      activityGroup: row["activityGroup"],
      campus: row["campus"],
      location: row["location"],
      dayOfWeek: this.DOW[dayStr.indexOf(row["dayOfWeek"])],
      startTime: row["startTime"],
      unitId: unit_object["id"],
      endTime: endTime,
    });

    try {
      activity_object = await Activity.createOrUpdateActivity(activity);
    } catch (err) {
      throw err;
    }
    const allocation = Allocation.create({
      activityId: activity_object.id,
      staffId: staff_object.id,
    });

    // Initial allocations are by default workforce approved
    allocation.isWorkforceApproved = true;

    try {
      let new_allocation = await Allocation.createOrUpdateAllocation(
        allocation
      );
      if (new_allocation.id) {
        await StatusLog.createOrIgnoreStatusLog(
          new_allocation,
          staff_object.id,
          user
        );
      }
    } catch (err) {
      throw err;
    }
  };

  /**
   * Takes the TpsObject input object, processes it and insert into the database
   * @param row TpsObject
   */
  processTpsObject = async (row: TpsObject) => {
    let unit_object: any;
    let staff_object: any;

    let unit = Unit.create({
      unitCode: row["unitCode"],
      offeringPeriod: row["offeringPeriod"],
      campus: row["campus"],
      year: 2020, // TODO: option to change year
      aqfTarget: Number(row["aqfTarget"]),
    });

    unit = cleanInputData(unit);
    try {
      unit_object = await Unit.createOrUpdateUnit(unit);
    } catch (err) {
      throw err;
    }

    let studyAqf: number =
      isNaN(Number(row["studyAqf"])) === true ? 0 : Number(row["studyAqf"]);

    const staffDetail = Staff.create({
      givenNames: row["givenNames"],
      lastName: row["lastNames"],
      aqf: Number(row["aqf"]),
      studyingAqf: studyAqf,
      email: row["email"],
    });

    try {
      staff_object = await Staff.createOrUpdateStaff(staffDetail);
    } catch (err) {
      throw err;
    }

    // have to check for unit id and staf id in the future, works now as eveything is unique
    let headCandidiate: boolean = row["headCandidiate"] === 1 ? true : false;
    const staffPreference = StaffPreference.create({
      preferenceScore: Number(row["preferenceScore"]),
      lecturerScore: Number(row["lecturerScore"]),
      isHeadTutorCandidate: headCandidiate,
      staffId: staff_object["id"],
      unitId: unit_object["id"],
    });

    try {
      await StaffPreference.createOrUpdateStaffPreference(staffPreference);
    } catch (err) {
      throw err;
    }

    for (const availability of row.availabilities) {
      this.createAvailabilityAndInsertIntoDB(
        availability.start,
        availability.end,
        availability.day,
        row,
        staff_object
      );
    }
  };

  /**
   * A function that creates an availability and inserts it into the database based on the inputs provided
   * @param start start time of the availability
   * @param end end time of the availability
   * @param dayOfWeek day_of_week enum
   * @param row TPS object
   * @param staff_object
   */
  createAvailabilityAndInsertIntoDB = (
    start: string,
    end: string,
    dayOfWeek: DayOfWeek,
    row: TpsObject,
    staff_object: any
  ) => {
    start = start.slice(0, -2) + ":" + start.slice(-2);
    end = end.slice(0, -2) + ":" + end.slice(-2);

    const availability = Availability.create({
      day: dayOfWeek,
      startTime: start,
      endTime: end,
      year: 2020,
      maxHours: Number(row["maxHours"]),
      maxNumberActivities: Number(row["maxNumberActivities"]),
      staffId: staff_object["id"],
    });
    try {
      let availabilityRepo = Availability.getRepository();
      availabilityRepo.save(availability);
    } catch (err) {
      throw err;
    }
  };

  /**
   * Processes the AllocateObject and inserts it into the database
   * @param row the input allocate object
   */
  processAllocateObject = async (row: AllocateObject) => {
    let unit_object: any;

    let unit = Unit.create({
      unitCode: row["unitCode"],
      offeringPeriod: row["offeringPeriod"],
      campus: row["campus"],
      year: 2020,
      aqfTarget: 0,
    });

    unit = cleanInputData(unit);
    try {
      unit_object = await Unit.createOrUpdateUnit(unit);
    } catch (err) {
      throw err;
    }

    let dayStr: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    let endTime = calculateEndTime(row["startTime"], Number(row["duration"]));
    const activity = Activity.create({
      activityCode: row["activityCode"],
      activityGroup: row["activityGroup"],
      campus: row["campus"],
      location: row["location"],
      dayOfWeek: this.DOW[dayStr.indexOf(row["dayOfWeek"])],
      startTime: row["startTime"],
      unitId: unit_object["id"],
      endTime: endTime,
      studentCount: row["studentCount"],
    });
    try {
      await Activity.createOrUpdateActivity(activity);
    } catch (err) {
      throw err;
    }

    let staff_in_charge: string = row["staff_in_charge"];
    if (staff_in_charge !== "-") {
      // Prob gotta get the id of staff using name here but unable to do so with current api
      // Then create a new allocation with activity_id and staff_id
    }
  };
}

/**
 * Maps the raw tas file to a TasObject that is below. Changes in the csv document can then be changed here
 * so the system's TasObject always remains the same
 * @param rawRow raw tas object
 * Returns TasObject
 */
export function mapRawTasFile(rawRow: RawTasObject) {
  try {
    // create the tas object that will be returned
    const tasObject: TasObject = {
      givenNames: rawRow["Tutor"].split(" ")[0],
      lastNames: rawRow["Tutor"].split(" ")[1],
      preferenceScore: rawRow["Tutor pref"],
      lecturerScore: rawRow["Lecturer pref"],
      isHeadTutorCandidate: rawRow["Head tutor"],
      aqf: rawRow["Tutor AQF"],
      email: rawRow["Email"],
      unitCode: rawRow["Subject"],
      offeringPeriod: rawRow["Subject Code"].slice(11, 13),
      activityCode: rawRow["Activity Code"],
      activityGroup: rawRow["Activity Group"],
      campus: rawRow["Campus"],
      dayOfWeek: rawRow["Day"],
      startTime: rawRow["Time"],
      duration: rawRow["Duration"],
      location: rawRow["Location"],
    };
    return tasObject;
  } catch (e) {
    console.log("Failed to read line");
    return null;
  }
}

/**
 * Maps the raw tps file to a TpsObject that is below. Changes in the csv document can then be changed here
 * so the system's TpsObject always remains the same
 * @param rawRow raw TpsObject
 * returns TpsObject
 */
export function mapRawTpsFile(rawRow: RawTpsObject) {
  try {
    // create the tas object that will be returned
    const tpsObject: TpsObject = {
      aqfTarget: rawRow["unit aqf target"],
      unitCode: rawRow["unit"].slice(0, 7),
      offeringPeriod: rawRow["unit"].slice(7),
      campus: rawRow["campus"],
      givenNames: rawRow["name"].split(" ")[0],
      lastNames: rawRow["name"].split(" ")[1],
      studyAqf: rawRow["tutors studying aqf"],
      aqf: rawRow["tutors aqf"],
      email: rawRow["email"],
      headCandidiate: rawRow["head tutor cand?"],
      preferenceScore: rawRow["tutors pref"],
      lecturerScore: rawRow["lec suitability"],
      availabilities: [
        {
          day: DayOfWeek.MONDAY,
          start: rawRow["M start"],
          end: rawRow["M end"],
        },
        {
          day: DayOfWeek.TUESDAY,
          start: rawRow["T start"],
          end: rawRow["T end"],
        },
        {
          day: DayOfWeek.WEDNESDAY,
          start: rawRow["W start"],
          end: rawRow["W end"],
        },
        {
          day: DayOfWeek.THURSDAY,
          start: rawRow["Th start"],
          end: rawRow["Th end"],
        },
        {
          day: DayOfWeek.FRIDAY,
          start: rawRow["F start"],
          end: rawRow["F end"],
        },
      ],
      maxHours: rawRow["max hr"],
      maxNumberActivities: rawRow["lecturer_override min classes"],
    };
    return tpsObject;
  } catch (e) {
    console.log("Failed to read line");
    return null;
  }
}

/**
 * Maps the raw allocate file to a AllocateObject object. Changes in the csv document can then be changed here
 * so the system's AllocateObject always remains the same
 * @param rawRow raw Allocate object row
 * returns AllocateObject
 */
export function mapRawAllocateFile(rawRow: RawAllocateObject) {
  try {
    // create the tas object that will be returned
    const allocateObject: AllocateObject = {
      unitCode: rawRow["subject_code"].slice(0, 7),
      offeringPeriod: rawRow["subject_code"].slice(11, 13),
      campus: rawRow["campus"],
      activityCode: rawRow["activity_code"],
      activityGroup: rawRow["activity_group_code"],
      location: rawRow["location"],
      duration: rawRow["duration"],
      dayOfWeek: rawRow["day_of_week"],
      startTime: rawRow["start_time"],
      staff_in_charge: rawRow["staff"],
      studentCount: rawRow["student_count"],
    };
    return allocateObject;
  } catch (e) {
    console.log("Failed to read line");
    return null;
  }
}

/**
 * Calculates the end time by adding the duration to the start time
 * @param startTimeParam starting time
 * @param durationParam duration
 * Return a string of the end time, HH:MM:SS
 */
function calculateEndTime(
  startTimeParam: string,
  durationParam: number
): string {
  /**
   * TODO: some recommendations here
   * - can calculate the end time on the database level
   * - or if not, should use javascript date libraries to do the calculation
   */
  let inputEndMinuteStr;
  let inputEndHourStr;
  let durationInHours = Math.floor(durationParam / 60);
  let durationInMins = durationParam % 60;
  let inputStartHour = parseInt(startTimeParam.split(":")[0]);
  let inputStartMinute = parseInt(startTimeParam.split(":")[1]);
  let inputEndMinute = inputStartMinute + durationInMins;
  let inputEndHour = inputStartHour + durationInHours;
  inputEndHourStr = inputEndHour.toString();
  if (inputEndMinute > 59) {
    inputEndMinute = inputEndMinute - 60;
    inputEndHourStr = (inputStartHour + durationInHours + 1).toString();
  }
  inputEndMinuteStr = inputEndMinute.toString();
  if (inputEndMinute < 10) {
    inputEndMinuteStr = "0" + inputEndMinute.toString();
  }
  let inputEndTime = inputEndHourStr + ":" + inputEndMinuteStr + ":00";
  return inputEndTime;
}

/**
 * The Raw object property names should match the column names of the spreadsheet
 */
type RawTasObject = {
  Tutor: string;
  Email: string;
  "Tutor pref": string;
  "Lecturer pref": string;
  "Head tutor": number;
  "Tutor AQF": string;
  Subject: string;
  "Subject Code": string;
  "Activity Group": string;
  "Activity Code": string;
  Campus: string;
  Day: string;
  Time: string;
  Duration: number;
  Location: string;
};

type RawTpsObject = {
  unit: string;
  campus: string;
  "unit aqf target": string;
  name: string;
  "tutors aqf": string;
  "tutors studying aqf": string;
  email: string;
  "head tutor cand?": number;
  "lec suitability": string;
  "tutors pref": string;
  "M start": string;
  "M end": string;
  "T start": string;
  "T end": string;
  "W start": string;
  "W end": string;
  "Th start": string;
  "Th end": string;
  "F start": string;
  "F end": string;
  "max hr": string;
  "lecturer_override min classes": string;
};

type RawAllocateObject = {
  subject_code: string;
  campus: string;
  activity_code: string;
  activity_group_code: string;
  location: string;
  duration: string;
  day_of_week: string;
  start_time: string;
  staff: string;
  student_count: number;
};

export type TasObject = {
  givenNames: string;
  lastNames: string;
  preferenceScore: string;
  lecturerScore: string;
  isHeadTutorCandidate: number;
  aqf: string;
  email: string;
  unitCode: string;
  offeringPeriod: string;
  activityCode: string;
  activityGroup: string;
  campus: string;
  dayOfWeek: string;
  startTime: string;
  duration: number;
  location: string;
};

export type TpsObject = {
  aqfTarget: string;
  unitCode: string;
  offeringPeriod: string;
  campus: string;
  givenNames: string;
  lastNames: string;
  preferenceScore: string;
  lecturerScore: string;
  studyAqf: string;
  aqf: string;
  email: string;
  headCandidiate: number;
  availabilities: Array<{ day: DayOfWeek; start: any; end: any }>;
  maxHours: string;
  maxNumberActivities: string;
};

export type AllocateObject = {
  unitCode: string;
  offeringPeriod: string;
  campus: string;
  activityCode: string;
  activityGroup: string;
  dayOfWeek: string;
  startTime: string;
  duration: string;
  location: string;
  staff_in_charge: string;
  studentCount: number;
};

export default ProcessFileService;
