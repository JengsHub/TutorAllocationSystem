import { Unit } from "~/entity";

// List of preferred semester/teaching period names to be displayed on the front and stored in the database
// Currently set to be `Moodle Semester` terminology
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

// Dictionary to map various semester/teaching periods string to their preferred versions (Moodle form)
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

const cleanInputData = (inputData: Unit): Unit => {
  let offeringPeriod: string = inputData["offeringPeriod"];
  // Further input cleaning
  let oPeriod = offeringPeriod

    // Conversion to make comparison case consistent
    .toUpperCase()

    // remove whitespaces
    .trim()

    // remove symbols
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")

    // remove unnecessary spaces left by previous replace() function
    .replace(/\s{2,}/g, " ");

  // Get consistent semester/teaching period from dictionary
  offeringPeriod = semesterNamesDict[oPeriod];

  // Reconstruct Units obj
  const returnData = Unit.create({
    unitCode: inputData["unitCode"],
    offeringPeriod: offeringPeriod,
    campus: inputData["campus"],
    year: inputData["year"],
    aqfTarget: inputData["aqfTarget"],
  });

  return returnData;
};

export default cleanInputData;
