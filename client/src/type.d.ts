enum DayOfWeek {
  MONDAY = "M",
  TUESDAY = "T",
  WEDNESDAY = "W",
  THURSDAY = "Th",
  FRIDAY = "F",
}

enum ApprovalEnum {
  INIT = "Init",
  LECTURER = "Lecturer",
  TA = "TA",
  WORKFORCE = "WorkForce",
}

interface IActivity {
  activityCode: string;
  activityGroup: string;
  allocations: IAllocation[];
  campus: string;
  dayOfWeek: DayOfWeek;
  endTime: string;
  id: string;
  location: string;
  startTime: string;
  unit: IUnit;
  unitId: string;
}

interface IStaff {
  aqf: number;
  email: string;
  givenNames: string;
  id: string;
  lastName: string;
  studyingAqf: number;
}

interface IPreferences {
  id: string;
  isHeadTutorCandidate: true;
  lecturerScore: number;
  preferenceScore: number;
  staffId: string;
  unitId: string;
  staff: IStaff;
  unit: IUnit;
}

interface IAllocation {
  id: string;
  activityId: string;
  staffId: string;
  approval: ApprovalEnum;
}

interface IAvailability {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  year: number;
  maxHours: number;
  maxNumberActivities: number;
  staffId: string;
}

interface IUnit {
  id: string;
  unitCode: string;
  offeringPeriod: string;
  campus: string;
  year: number;
  aqfTarget: number;
}

interface IRule {
  id: string;
  ruleName: string;
  ruleDescription: string;
  value: number;
}

interface myAllocations {
  allocation_id: string;
  allocation_approval: string;
  allocation_activityId: string;
  allocation_staffId: string;
  activity_id: string;
  activity_activityCode: string;
  activity_activityGroup: string;
  activity_campus: string;
  activity_location: string;
  activity_endTime: string;
  activity_dayOfWeek: DayOfWeek;
  activity_startTime: string;
  activity_duration: number;
  activity_unitId: string;
  unit_id: string;
  unit_unitCode: string;
  unit_offeringPeriod: string;
  unit_campus: string;
  unit_year: number;
  unit_aqfTarget: number;
}
