import DOMPurify from "dompurify";
/////////////////
let preferredSemesterName = {
  FULLYEAR: "FY",
  "SEMESTER 1": "S1",
  "MONASH ONLINE 2": "MO-TP2",
  "MONASH ONLINE 3": "MO-TP3",
  "TERM 3": "T3",
  "WINTER SEMESTER": "WS",
  "MONASH ONLINE 4": "MO-TP4",
  "SEMESTER 2 SEMESTER 1": "S2-S1",
  "SEMESTER 2 SUMMER A": "S2-SS",
  "SEMESTER 2": "S2",
  "MONASH ONLINE 5": "MO-TP5",
  "OCTOBER INTAKE MALAYSIA": "OCT-MY",
  "MONASH ONLINE 6": "MO-TP6",
  "NOVEMBER 12WEEK TEACHING PERIOD": "Nov",
  "SUMMER SEMESTER A": "SSA",
  "SUMMER SEMESTER B": "SSB",
  "MONASH ONLINE 1": "MO-TP1",
};

let semesterNamesDict: { [key: string]: string } = {
  // Full Year
  FULLYEAR: preferredSemesterName[`FULLYEAR`],
  FY01: preferredSemesterName[`FULLYEAR`],
  FY: preferredSemesterName[`FULLYEAR`],
  "FULL YEAR OFFICIAL CALENDAR": preferredSemesterName[`FULLYEAR`],

  // SEMESTER 1
  "SEMESTER 1": preferredSemesterName[`SEMESTER 1`],
  S101: preferredSemesterName[`SEMESTER 1`],
  S1: preferredSemesterName[`SEMESTER 1`],
  "SEM 1 OFFICIAL CALENDAR": preferredSemesterName[`SEMESTER 1`],

  // Monash online 2
  "MONASH ONLINE 2": preferredSemesterName[`MONASH ONLINE 2`],
  MOTP201: preferredSemesterName[`MONASH ONLINE 2`],
  MOTP2: preferredSemesterName[`MONASH ONLINE 2`],
  TP2: preferredSemesterName[`MONASH ONLINE 2`],
  "MONASH ONLINE TEACHING PERIOD 2": preferredSemesterName[`MONASH ONLINE 2`],

  // Monash online 3
  "MONASH ONLINE 3": preferredSemesterName[`MONASH ONLINE 3`],
  MOTP301: preferredSemesterName[`MONASH ONLINE 3`],
  MOTP3: preferredSemesterName[`MONASH ONLINE 3`],
  TP3: preferredSemesterName[`MONASH ONLINE 3`],
  "MONASH ONLINE TEACHING PERIOD 3": preferredSemesterName[`MONASH ONLINE 3`],

  // Term 3
  "TERM 3": preferredSemesterName[`TERM 3`],
  T357: preferredSemesterName[`TERM 3`],
  T3: preferredSemesterName[`TERM 3`],

  // Winter Semester
  "WINTER SEMESTER": preferredSemesterName[`WINTER SEMESTER`],
  WS01: preferredSemesterName[`WINTER SEMESTER`],
  WS: preferredSemesterName[`WINTER SEMESTER`],
  WINTER: preferredSemesterName[`WINTER SEMESTER`],

  // Monash online 4
  "MONASH ONLINE 4": preferredSemesterName[`MONASH ONLINE 4`],
  MOTP401: preferredSemesterName[`MONASH ONLINE 4`],
  MOTP4: preferredSemesterName[`MONASH ONLINE 4`],
  TP4: preferredSemesterName[`MONASH ONLINE 4`],
  "MONASH ONLINE TEACHING PERIOD 4": preferredSemesterName[`MONASH ONLINE 4`],

  // SEMESTER 2 SEMESTER 1
  "SEMESTER 2 SEMESTER 1": preferredSemesterName[`SEMESTER 2 SEMESTER 1`],
  SSS102: preferredSemesterName[`SEMESTER 2 SEMESTER 1`],
  S2S1: preferredSemesterName[`SEMESTER 2 SEMESTER 1`],
  "SEMESTER 2 SEMESTER 1 OFFICIAL CALENDAR":
    preferredSemesterName[`SEMESTER 2 SEMESTER 1`],

  // SEMESTER 2 SUMMER A
  "SEMESTER 2 SUMMER A": preferredSemesterName[`SEMESTER 2 SUMMER A`],
  S2SS02: preferredSemesterName[`SEMESTER 2 SUMMER A`],
  S2SS: preferredSemesterName[`SEMESTER 2 SUMMER A`],
  "SEMESTER 2 SUMMER": preferredSemesterName[`SEMESTER 2 SUMMER A`],

  // SEMESTER 2
  "SEMESTER 2": preferredSemesterName[`SEMESTER 2`],
  S201: preferredSemesterName[`SEMESTER 2`],
  S2: preferredSemesterName[`SEMESTER 2`],
  "SEM 2 OFFICIAL CALENDAR": preferredSemesterName[`SEMESTER 2`],

  // MONASH ONLINE 5
  "MONASH ONLINE 5": preferredSemesterName[`MONASH ONLINE 5`],
  MOTP501: preferredSemesterName[`MONASH ONLINE 5`],
  MOTP5: preferredSemesterName[`MONASH ONLINE 5`],
  TP5: preferredSemesterName[`MONASH ONLINE 5`],
  "MONASH ONLINE TEACHING PERIOD 5": preferredSemesterName[`MONASH ONLINE 5`],

  // OCTOBER INTAKE MALAYSIA
  "OCTOBER INTAKE MALAYSIA": preferredSemesterName[`OCTOBER INTAKE MALAYSIA`],
  OCTMY01: preferredSemesterName[`OCTOBER INTAKE MALAYSIA`],
  OCTMY: preferredSemesterName[`OCTOBER INTAKE MALAYSIA`],
  "OCTOBER MALAYSIA": preferredSemesterName[`OCTOBER INTAKE MALAYSIA`],
  "OCTOBER INTAKE TEACHING PERIOD MALAYSIA CAMPUS":
    preferredSemesterName[`OCTOBER INTAKE MALAYSIA`],

  // MONASH ONLINE 6
  "MONASH ONLINE 6": preferredSemesterName[`MONASH ONLINE 6`],
  MOTP601: preferredSemesterName[`MONASH ONLINE 6`],
  MOTP6: preferredSemesterName[`MONASH ONLINE 6`],
  TP6: preferredSemesterName[`MONASH ONLINE 6`],
  "MONASH ONLINE TEACHING PERIOD 6": preferredSemesterName[`MONASH ONLINE 6`],

  // NOVEMBER (12 WEEK TEACHING PERIOD)
  "NOVEMBER 12WEEK TEACHING PERIOD":
    preferredSemesterName[`NOVEMBER 12WEEK TEACHING PERIOD`],
  NOV12: preferredSemesterName[`NOVEMBER 12WEEK TEACHING PERIOD`],
  NOV: preferredSemesterName[`NOVEMBER 12WEEK TEACHING PERIOD`],
  NOVEMBER: preferredSemesterName[`NOVEMBER 12WEEK TEACHING PERIOD`],
  "NOVEMBER 12 WEEK TEACHING PERIOD":
    preferredSemesterName[`NOVEMBER 12WEEK TEACHING PERIOD`],

  // SUMMER SEMESTER A
  "SUMMER SEMESTER A": preferredSemesterName[`SUMMER SEMESTER A`],
  SSA02: preferredSemesterName[`SUMMER SEMESTER A`],
  SSA: preferredSemesterName[`SUMMER SEMESTER A`],
  "SUMMER A": preferredSemesterName[`SUMMER SEMESTER A`],
  "SUMMER SEMESTER A OFFICIAL CALENDAR":
    preferredSemesterName[`SUMMER SEMESTER A`],

  // SUMMER SEMESTER B
  "SUMMER SEMESTER B": preferredSemesterName[`SUMMER SEMESTER B`],
  SSB02: preferredSemesterName[`SUMMER SEMESTER B`],
  SSB: preferredSemesterName[`SUMMER SEMESTER B`],
  "SUMMER B": preferredSemesterName[`SUMMER SEMESTER B`],
  "SUMMER SEMESTER B OFFICIAL CALENDAR":
    preferredSemesterName[`SUMMER SEMESTER B`],

  // MONASH ONLINE 1
  "MONASH ONLINE 1": preferredSemesterName[`MONASH ONLINE 1`],
  MOTP101: preferredSemesterName[`MONASH ONLINE 1`],
  MOTP1: preferredSemesterName[`MONASH ONLINE 1`],
  TP1: preferredSemesterName[`MONASH ONLINE 1`],
  "MONASH ONLINE TEACHING PERIOD 1": preferredSemesterName[`MONASH ONLINE 1`],
};

/////////////////

/** 
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
*/

const cleanInputData = (inputData: Units): Units => {
  // DOMPurify library sanitizes imported data for security reasons; prevents XSS
  let unitCode: string = DOMPurify.sanitize(inputData["unitCode"]);
  var offeringPeriod: string = DOMPurify.sanitize(inputData["offeringPeriod"]);
  let campus: string = DOMPurify.sanitize(inputData["campus"]);
  let year: string = DOMPurify.sanitize(String(inputData["year"]));
  let aqfTarget: string = DOMPurify.sanitize(String(inputData["aqfTarget"]));

  let oPeriod = offeringPeriod
    // Conversion to make comparison case consistent
    .toUpperCase()
    // remove whitespaces
    .trim()
    // remove symbols
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    // remove unnecessary spaces left by previous replace() function
    .replace(/\s{2,}/g, " ");
  offeringPeriod = semesterNamesDict[oPeriod];
  /** 
  loop: for (let i = 0; i < teachingPeriods.length; i++) {
    for (let j = 0; j < teachingPeriods[i].length; j++) {
      let oPeriod = offeringPeriod
        // Conversion to make comparison case consistent
        .toUpperCase()
        // remove whitespaces
        .trim()
        // remove symbols
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        // remove unnecessary spaces left by previous replace() function
        .replace(/\s{2,}/g, " ");
      let abbr = teachingPeriods[i][j]
        // Conversion to make comparison case consistent
        .toUpperCase()
        // remove whitespaces
        .trim()
        // remove symbols
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        // remove unnecessary spaces left by previous replace() function
        .replace(/\s{2,}/g, " ");
      if (oPeriod === abbr) {
        // Final version is the first entry in each list, modify order in teachingPeriods to alter version stored in database and presented to frontend
        offeringPeriod = teachingPeriods[i][0];
        break loop;
      }
    }
  }*/

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
