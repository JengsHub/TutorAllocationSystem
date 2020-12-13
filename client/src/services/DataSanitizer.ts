import DOMPurify from "dompurify";

const fullYear = [
  "Full-Year", // Master version
  "FY-01",
  "FY",
  "Full-year",
  "FULL YEAR (OFFICIAL CALENDAR)",
];
const semesterOne = [
  "Semester 1", // Master version
  "S1-01",
  "S1",
  "Semester 1",
  "SEM 1 (OFFICIAL CALENDAR)",
];
const semesterTwo = [
  "Semester 2", // Master version
  "Monash online 2",
  "S2-01",
  "S2",
  "Semester 2",
  "Sem 2 (OFFICIAL CALENDAR)",
];
const monashOnlineOne = [
  "Monash online 1", // Master version
  "MO-TP1-01",
  "MO-TP1",
  "TP1",
  "MONASH ONLINE - TEACHING PERIOD 1",
];
const monashOnlineTwo = [
  "Monash online 2", // Master version
  "MO-TP2-01",
  "MO-TP2",
  "TP2",
  "MONASH ONLINE - TEACHING PERIOD 2",
];
const monashOnlineThree = [
  "Monash online 3", // Master version
  "MO-TP3-01",
  "MO-TP3",
  "TP3",
  "MONASH ONLINE - TEACHING PERIOD 3",
];
const monashOnlineFour = [
  "Monash online 4", // Master version
  "MO-TP4-01",
  "MO-TP4",
  "TP4",
  "MONASH ONLINE - TEACHING PERIOD 4",
];
const monashOnlineFive = [
  "Monash online 5", // Master version
  "MO-TP5-01",
  "MO-TP5",
  "TP5",
  "MONASH ONLINE - TEACHING PERIOD 5",
];
const monashOnlineSix = [
  "Monash online 6", // Master version
  "MO-TP6-01",
  "MO-TP6",
  "TP6",
  "MONASH ONLINE - TEACHING PERIOD 6",
];
const term3 = [
  "Term 3", // Master version
  "T3-57",
  "T3",
  "Term 3",
  "Term 3",
  "TERM 3",
];
const winterSemester = [
  "Winter semester", // Master version
  "WS-01",
  "WS",
  "Winter",
  "WINTER SEMESTER",
];
const semesterTwoSemesterOne = [
  "Semester 2 - Semester 1", // Master version
  "SS-S1-02",
  "S2-S1",
  "Semester 2 - Semester 1",
  "SEMESTER 2 - SEMESTER 1 (OFFICIAL CALENDAR)",
];
const semesterTwoSummerA = [
  "Semester 2 - summer A", // Master version
  "S2-SS-02",
  "S2-SS",
  "Semester 2 - Summer",
  "Semester 2 - Summer A",
];
const octoberIntakeMalaysia = [
  "October intake - Malaysia", // Master version
  "OCT-MY-01",
  "OCT-MY",
  "October Malaysia",
  "OCTOBER INTAKE TEACHING PERIOD, MALAYSIA CAMPUS",
];
const november12WeekTeachingPeriod = [
  "November (12-week teaching period)", // Master version
  "Nov12",
  "Nov",
  "November",
  "NOVEMBER 12 WEEK TEACHING PERIOD",
];
const summberSemesterA = [
  "Summer semester A", // Master version
  "SSA-02",
  "SSA",
  "Summer A",
  "SUMMER SEMESTER A (OFFICIAL CALENDAR)",
];
const summberSemesterB = [
  "Summer semester B", // Master version
  "SSB-02",
  "SSB",
  "Summer B",
  "SUMMER SEMESTER B (OFFICIAL CALENDAR)",
];

const teachingPeriods = [
  fullYear,
  semesterOne,
  semesterTwo,
  monashOnlineOne,
  monashOnlineTwo,
  monashOnlineThree,
  monashOnlineFour,
  monashOnlineFive,
  monashOnlineSix,
  term3,
  winterSemester,
  semesterTwoSemesterOne,
  semesterTwoSummerA,
  octoberIntakeMalaysia,
  november12WeekTeachingPeriod,
  summberSemesterA,
  summberSemesterB,
];

const cleanInputData = (inputData: Units): Units => {
  // DOMPurify library sanitizes imported data for security reasons; prevents XSS
  let unitCode: string = DOMPurify.sanitize(inputData["unitCode"]);
  var offeringPeriod: string = DOMPurify.sanitize(inputData["offeringPeriod"]);
  let campus: string = DOMPurify.sanitize(inputData["campus"]);
  let year: string = DOMPurify.sanitize(String(inputData["year"]));
  let aqfTarget: string = DOMPurify.sanitize(String(inputData["aqfTarget"]));

  loop: for (let i = 0; i < teachingPeriods.length; i++) {
    for (let j = 0; j < teachingPeriods[i].length; j++) {
      let oPeriod = offeringPeriod
        // Conversion to make comparison case consistent
        .toUpperCase()
        // remove whitespaces
        .trim()
        // remove symbols
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        // remove unnecessary spaces left by previous replace() function
        .replace(/\s{2,}/g, " ");
      let abbr = teachingPeriods[i][j]
        // Conversion to make comparison case consistent
        .toUpperCase()
        // remove whitespaces
        .trim()
        // remove symbols
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        // remove unnecessary spaces left by previous replace() function
        .replace(/\s{2,}/g, " ");
      if (oPeriod === abbr) {
        // Final version is the first entry in each list, modify order in teachingPeriods to alter version stored in database and presented to frontend
        offeringPeriod = teachingPeriods[i][0];
        break loop;
      }
    }
  }

  const returnData: Units = {
    unitCode: unitCode,
    offeringPeriod: offeringPeriod,
    campus: campus,
    year: parseInt(year),
    aqfTarget: parseInt(aqfTarget),
  };

  return returnData;
};

export default cleanInputData;
