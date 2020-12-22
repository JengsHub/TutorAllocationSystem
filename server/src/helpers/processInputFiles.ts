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

type TasObject = {
  Tutor: string;
  Email: string;
  "Tutor pref": string;
  "Lecturer pref": string;
  "Head tutor": string;
  "Tutor AQF": string;
  Subject: string;
  "Subject Code": string;
  "Activity Group": string;
  "Activity Code": string;
  Campus: string;
  "Day:": string;
  "Time:": string;
  "Duration:": string;
  "Location:": string;
};

type TpsObject = {
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

type AllocateObject = {
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

  processTasObject = async (row: TasObject) => {
    let tempList: string[] = this.allocateList[0];
    let unit_object: any;
    let staff_object: any;
    let activity_object: any;

    for (let i = 1; i < this.allocateList.length; i++) {
      var unit: IUnit = {
        unitCode: row["Subject"],
        offeringPeriod: row["Subject Code"].slice(11, 13),
        campus: row["Campus"],
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

      let name: string[] = row["Tutor"].split(" ");
      let studyAqf: number =
        isNaN(Number(row["Tutor AQF"])) === true ? 0 : Number(row["Tutor AQF"]);
      var staffDetail: IStaff = {
        givenNames: name[0],
        lastName: name[1],
        aqf: studyAqf,
        studyingAqf: 0,
        email: this.allocateList[i][tempList.indexOf("Email")],
      };
      try {
        staff_object = await Staff.insertStaffIntoDb(staffDetail);
        // console.log(staff_object)
      } catch (err) {
        throw err;
      }

      // Lecture pref could have decimals so we might need to modify database type
      let headCandidiate: boolean =
        this.allocateList[i][tempList.indexOf("Head tutor")] === 1
          ? true
          : false;
      var staffPreference: IStaffPreference = {
        preferenceScore: Math.floor(
          Number(this.allocateList[i][tempList.indexOf("Tutor pref")])
        ),
        lecturerScore: Math.floor(
          Number(this.allocateList[i][tempList.indexOf("Lecturer pref")])
        ),
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
        activityCode: this.allocateList[i][tempList.indexOf("Activity Code")],
        activityGroup: this.allocateList[i][tempList.indexOf("Activity Group")],
        campus: this.allocateList[i][tempList.indexOf("Campus")],
        location: this.allocateList[i][tempList.indexOf("Location")],
        duration: Number(this.allocateList[i][tempList.indexOf("Duration")]),
        dayOfWeek: this.DOW[
          dayStr.indexOf(this.allocateList[i][tempList.indexOf("Day")])
        ],
        startTime: this.allocateList[i][tempList.indexOf("Time")],
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
    }
  };

  processTpsObject = async (row: TpsObject) => {
    let unit_object: any;
    let staff_object: any;

    for (let i = 1; i < this.allocateList.length; i++) {
      var unit: IUnit = {
        unitCode: row["unit"].slice(0, 7),
        offeringPeriod: row["unit"].slice(7),
        campus: row["campus"],
        year: 2020,
        aqfTarget: Number(row["unit aqf target"]),
      };
      unit = cleanInputData(unit);
      try {
        unit_object = await Unit.insertUnitIntoDb(unit);
        // console.log(unit_object)
      } catch (err) {
        throw err;
      }

      let name: string[] = row["name"].split(" ");
      let studyAqf: number =
        isNaN(Number(row["tutors studying aqf"])) === true
          ? 0
          : Number(row["tutors studying aqf"]);
      var staffDetail: IStaff = {
        givenNames: name[0],
        lastName: name[1],
        aqf: Number(row["tutors aqf"]),
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
      let headCandidiate: boolean =
        row["head tutor cand?"] === 1 ? true : false;
      var staffPreference: IStaffPreference = {
        preferenceScore: Number(row["tutors pref"]),
        lecturerScore: Number(row["lec suitability"]),
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

      var start: string = row["M start"];
      var end: string = row["M end"];
      this.createAvailabilityAndInsertIntoDB(
        start,
        end,
        DayOfWeek.MONDAY,
        row,
        staff_object
      );
      start = row["T start"];
      end = row["T end"];
      this.createAvailabilityAndInsertIntoDB(
        start,
        end,
        DayOfWeek.TUESDAY,
        row,
        staff_object
      );
      start = row["W start"];
      end = row["W end"];
      this.createAvailabilityAndInsertIntoDB(
        start,
        end,
        DayOfWeek.WEDNESDAY,
        row,
        staff_object
      );
      start = row["Th start"];
      end = row["Th end"];
      this.createAvailabilityAndInsertIntoDB(
        start,
        end,
        DayOfWeek.THURSDAY,
        row,
        staff_object
      );
      start = row["F start"];
      end = row["F end"];
      this.createAvailabilityAndInsertIntoDB(
        start,
        end,
        DayOfWeek.FRIDAY,
        row,
        staff_object
      );
    }
  };

  processAllocateObject = async (row: AllocateObject) => {
    let unit_object: any;

    for (let i = 1; i < this.allocateList.length; i++) {
      var unit: IUnit = {
        unitCode: row["subject_code"].slice(0, 7),
        offeringPeriod: row["subject_code"].slice(11, 13),
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
        activityCode: row["activity_code"],
        activityGroup: row["activity_group_code"],
        campus: row["campus"],
        location: row["location"],
        duration: Number(row["duration"]),
        dayOfWeek: this.DOW[dayStr.indexOf(row["day_of_week"])],
        startTime: row["start_time"],
        unitId: unit_object["data"]["id"],
      };
      try {
        await Activity.insertActivityIntoDb(activity);
      } catch (err) {
        throw err;
      }

      let staff_in_charge: string = row["staff"];
      if (staff_in_charge !== "-") {
        // Prob gotta get the id of staff using name here but unable to do so with current api
        // Then create a new allocation with activity_id and staff_id
      }
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
      maxHours: Number(row["max hr"]),
      maxNumberActivities: Number(row["lecturer_override min classes"]),
      staffId: staff_object["data"]["id"],
    };
    try {
      Availability.insertAvailabilityIntoDb(availability);
    } catch (err) {
      throw err;
    }
  };
}

export default ProcessFileService;
