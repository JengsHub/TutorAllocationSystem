import { DayOfWeek } from "../enums/DayOfWeek";
import cleanInputData from "./dataSanitizer";
import {
  Activity,
  Allocation,
  Availability,
  Staff,
  StaffPreference,
  Unit,
} from "~/entity";
import {
  IUnit,
  IStaff,
  IStaffPreference,
  IActivity,
  IAllocation,
  IAvailability,
} from "~/interfaces/typesInputEntites";
import {
  AllocateObject,
  mapRawAllocateFile,
  mapRawTasFile,
  mapRawTpsFile,
  TpsObject,
  TasObject,
} from "./mapRawInputToEntity";

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
};

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
    console.log("obtain result: " + this.allocateList.toString());
  };

  processTasObject = async (rawRow: any) => {
    let unit_object: any;
    let staff_object: any;
    let activity_object: any;
    // map the raw row into a an tas object that matches the system's convention
    let row: TasObject = mapRawTasFile(rawRow);
    console.log("Processing row: ");
    console.log(row);
    var unit: IUnit = {
      unitCode: row["unitCode"],
      offeringPeriod: row["offeringPeriod"],
      campus: row["campus"],
      year: 2020,
      aqfTarget: 0,
    };
    unit = cleanInputData(unit);
    try {
      console.log("going to insert");
      console.log(unit);
      unit_object = await Unit.insertUnitIntoDb(unit);
      // console.log(unit_object)
    } catch (err) {
      throw err;
    }

    let studyAqf: number =
      isNaN(Number(row["aqf"])) === true ? 0 : Number(row["aqf"]);
    var staffDetail: IStaff = {
      givenNames: row["givenNames"],
      lastName: row["lastNames"],
      aqf: studyAqf,
      studyingAqf: 0,
      email: row["email"],
    };
    try {
      staff_object = await Staff.insertStaffIntoDb(staffDetail);
      // console.log(staff_object)
    } catch (err) {
      throw err;
    }

    // Lecture pref could have decimals so we might need to modify database type
    let headCandidiate: boolean =
      row["isHeadTutorCandidate"] === 1 ? true : false;
    var staffPreference: IStaffPreference = {
      preferenceScore: Math.floor(Number(row["preferenceScore"])),
      lecturerScore: Math.floor(Number(row["lecturerScore"])),
      isHeadTutorCandidate: headCandidiate,
      staffId: staff_object["data"]["id"],
      unitId: unit_object["data"]["id"],
    };
    try {
      await StaffPreference.insertStaffPreferencesIntoDb(staffPreference);
    } catch (err) {
      throw err;
    }

    let dayStr: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    var activity: IActivity = {
      activityCode: row["activityCode"],
      activityGroup: row["activityGroup"],
      campus: row["campus"],
      location: row["location"],
      duration: row["duration"],
      dayOfWeek: this.DOW[dayStr.indexOf(row["dayOfWeek"])],
      startTime: row["startTime"],
      unitId: unit_object["data"]["id"],
    };
    try {
      activity_object = await Activity.insertActivityIntoDb(activity);
      // console.log(activity_object)
    } catch (err) {
      throw err;
    }

    var allocation: IAllocation = {
      activityId: activity_object.id,
      staffId: staff_object.id,
    };
    try {
      await Allocation.insertAllocationIntoDb(allocation);
    } catch (err) {
      throw err;
    }
    
  };

  processTpsObject = async (rawRow: any) => {
    let unit_object: any;
    let staff_object: any;
    // map the raw row into an tps object
    let row: TpsObject = mapRawTpsFile(rawRow);

    var unit: IUnit = {
      unitCode: row["unitCode"],
      offeringPeriod: row["offeringPeriod"],
      campus: row["campus"],
      year: 2020,
      aqfTarget: Number(row["aqfTarget"]),
    };
    unit = cleanInputData(unit);
    try {
      unit_object = await Unit.insertUnitIntoDb(unit);
      // console.log(unit_object)
    } catch (err) {
      throw err;
    }

    let studyAqf: number =
      isNaN(Number(row["studyAqf"])) === true ? 0 : Number(row["studyAqf"]);
    var staffDetail: IStaff = {
      givenNames: row["givenNames"],
      lastName: row["lastNames"],
      aqf: Number(row["aqf"]),
      studyingAqf: studyAqf,
      email: row["email"],
    };
    try {
      staff_object = await Staff.insertStaffIntoDb(staffDetail);
      // console.log(staff_object)
    } catch (err) {
      throw err;
    }

    // have to check for unit id and staf id in the future, works now as eveything is unique
    let headCandidiate: boolean = row["headCandidiate"] === 1 ? true : false;
    var staffPreference: IStaffPreference = {
      preferenceScore: Number(row["preferenceScore"]),
      lecturerScore: Number(row["lecturerScore"]),
      isHeadTutorCandidate: headCandidiate,
      staffId: staff_object["data"]["id"],
      unitId: unit_object["data"]["id"],
    };
    try {
      await StaffPreference.insertStaffPreferencesIntoDb(staffPreference);
      // console.log(response)
    } catch (err) {
      throw err;
    }

    const starts: string[] = [
      row["startTimeMon"],
      row["startTimeTue"],
      row["startTimeWed"],
      row["startTimeThu"],
      row["startTimeFri"],
    ];
    const ends: string[] = [
      row["endTimeMon"],
      row["endTimeTue"],
      row["endTimeWed"],
      row["endTimeThu"],
      row["endTimeFri"],
    ];
    const days: DayOfWeek[] = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
    ];

    for (let i = 0; i < days.length; i++) {
      this.createAvailabilityAndInsertIntoDB(
        starts[i],
        ends[i],
        days[i],
        row,
        staff_object
      );
    }
  };

  createAvailabilityAndInsertIntoDB = (
    start: string,
    end: string,
    dayOfWeek: DayOfWeek,
    row: TpsObject,
    staff_object: any
  ) => {
    start = start.slice(0, -2) + ":" + start.slice(-2);
    end = end.slice(0, -2) + ":" + end.slice(-2);

    var availability: IAvailability = {
      day: dayOfWeek,
      startTime: start,
      endTime: end,
      year: 2020,
      maxHours: Number(row["maxHours"]),
      maxNumberActivities: Number(row["maxNumberActivities"]),
      staffId: staff_object["data"]["id"],
    };
    try {
      Availability.insertAvailabilityIntoDb(availability);
    } catch (err) {
      throw err;
    }
  };

  processAllocateObject = async (rawRow: any) => {
    let unit_object: any;
    let row: AllocateObject = mapRawAllocateFile(rawRow);

    var unit: IUnit = {
      unitCode: row["unitCode"],
      offeringPeriod: row["offeringPeriod"],
      campus: row["campus"],
      year: 2020,
      aqfTarget: 0,
    };
    unit = cleanInputData(unit);
    try {
      unit_object = await Unit.insertUnitIntoDb(unit);
      // console.log(unit_object)
    } catch (err) {
      throw err;
    }

    let dayStr: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    var activity: IActivity = {
      activityCode: row["activityCode"],
      activityGroup: row["activityGroup"],
      campus: row["campus"],
      location: row["location"],
      duration: Number(row["duration"]),
      dayOfWeek: this.DOW[dayStr.indexOf(row["dayOfWeek"])],
      startTime: row["startTime"],
      unitId: unit_object["data"]["id"],
    };
    try {
      await Activity.insertActivityIntoDb(activity);
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

export default ProcessFileService;
