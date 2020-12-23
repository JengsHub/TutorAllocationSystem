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
  dayOfWeek: string;
  startTime: string;
  duration: string;
  location: string;
  givenNames: string;
  lastNames: string;
  preferenceScore: string;
  lecturerScore: string;
  studyAqf: string;
  aqf: string;
  email: string;
  headCandidiate: number;
  startTimeMon: string;
  startTimeTue: string;
  startTimeWed: string;
  startTimeThu: string;
  startTimeFri: string;
  endTimeMon: string;
  endTimeTue: string;
  endTimeWed: string;
  endTimeThu: string;
  endTimeFri: string;
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
};

export const mapRawTasFile = (rawRow: any) => {
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
};

export const mapRawTpsFile = (rawRow: any) => {
  // create the tas object that will be returned
  const tpsObject: TpsObject = {
    aqfTarget: rawRow["unit aqf target"],
    unitCode: rawRow["unit"].slice(0, 7),
    offeringPeriod: rawRow["unit"].slice(7),
    campus: rawRow["campus"],
    dayOfWeek: rawRow["Day"],
    startTime: rawRow["Time"],
    duration: rawRow["Duration"],
    location: rawRow["Location"],
    givenNames: rawRow["name"].split(" ")[0],
    lastNames: rawRow["name"].split(" ")[1],
    studyAqf: rawRow["tutors studying aqf"],
    aqf: rawRow["tutors aqf"],
    email: rawRow["email"],
    headCandidiate: rawRow["head tutor cand?"],
    preferenceScore: rawRow["tutors pref"],
    lecturerScore: rawRow["lec suitability"],
    startTimeMon: rawRow["M start"],
    startTimeTue: rawRow["T start"],
    startTimeWed: rawRow["W start"],
    startTimeThu: rawRow["Th start"],
    startTimeFri: rawRow["F start"],
    endTimeMon: rawRow["M end"],
    endTimeTue: rawRow["T end"],
    endTimeWed: rawRow["W end"],
    endTimeThu: rawRow["Th end"],
    endTimeFri: rawRow["F end"],
    maxHours: rawRow["max hr"],
    maxNumberActivities: rawRow["lecturer_override min classes"],
  };
  return tpsObject;
};

export const mapRawAllocateFile = (rawRow: any) => {
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
  };
  return allocateObject;
};
