import { DayOfWeek } from "../enums/DayOfWeek";
import cleanInputData from "../services/DataSanitizerService";
import { Units, Staff, StaffPreference, Activity, Allocation } from "../../../client/src/types";

type TasObject = {
    "Tutor": string,
    "Email": string,
    "Tutor pref": string,
    "Lecturer pref": string,
    "Head tutor": string,
    "Tutor AQF": string,
    "Subject": string,
    "Subject Code": string,
    "Activity Group": string,
    "Activity Code": string,
    "Campus": string,
    "Day:": string,
    "Time:": string,
    "Duration:": string,
    "Location:": string
}

export class ProcessFileService{
    allocateList: any[] = [[]];

    obtainResult = (results: any) => {
        this.allocateList = results.data;
        console.log("obtain result: " + this.allocateList.toString());
    };

    processObject = (row: TasObject) =>{
        let tempList: string[] = this.allocateList[0];
        let unit_object: any;
        let staff_object: any;
        let activity_object: any;
        
        for (let i = 1; i < this.allocateList.length; i++) {
            var unit: Units = {
            unitCode: row["Subject"],
            offeringPeriod: row["Subject Code"].slice(11, 13),
            campus: row["Campus"],
            year: 2020,
            aqfTarget: 0,
            };
            unit = cleanInputData(unit);
            try {
            unit_object = await DatabaseFinder.post("/units", unit);
            // console.log(unit_object)
            } catch (err) {
            throw err;
            }

            let name: string[] = row["Tutor"].split(" ");
            let studyAqf: number =
            isNaN(Number(row["Tutor AQF"])) ===
            true
                ? 0
                : Number(row["Tutor AQF"]);
            var staffDetail: Staff = {
            givenNames: name[0],
            lastName: name[1],
            aqf: studyAqf,
            studyingAqf: 0,
            email: this.allocateList[i][tempList.indexOf("Email")],
            };
            try {
            staff_object = await DatabaseFinder.post("/staff", staffDetail);
            // console.log(staff_object)
            } catch (err) {
            throw err;
            }

            // Lecture pref could have decimals so we might need to modify database type
            let headCandidiate: boolean =
            this.allocateList[i][tempList.indexOf("Head tutor")] === 1
                ? true
                : false;
            var staffPreference: StaffPreference = {
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
            await DatabaseFinder.post("/staffpreferences", staffPreference);
            } catch (err) {
            throw err;
            }

            let DOW: DayOfWeek[] = [
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
            ];
            let dayStr: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
            var activity: Activity = {
            activityCode: this.allocateList[i][tempList.indexOf("Activity Code")],
            activityGroup: this.allocateList[i][tempList.indexOf("Activity Group")],
            campus: this.allocateList[i][tempList.indexOf("Campus")],
            location: this.allocateList[i][tempList.indexOf("Location")],
            duration: Number(this.allocateList[i][tempList.indexOf("Duration")]),
            dayOfWeek:
                DOW[dayStr.indexOf(this.allocateList[i][tempList.indexOf("Day")])],
            startTime: this.allocateList[i][tempList.indexOf("Time")],
            unitId: unit_object["data"]["id"],
            };
            try {
            activity_object = await DatabaseFinder.post("/activities", activity);
            // console.log(activity_object)
            } catch (err) {
            throw err;
            }

            var allocation: Allocation = {
            activityId: activity_object["data"]["id"],
            staffId: staff_object["data"]["id"],
            };
            try {
            await DatabaseFinder.post("/allocations", allocation);
            } catch (err) {
            throw err;
            }
        }
        this.showSuccess();
    };


}

export default ProcessFileService;