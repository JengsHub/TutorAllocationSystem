enum DayOfWeek {
  MONDAY = "M",
  TUESDAY = "T",
  WEDNESDAY = "W",
  THURSDAY = "Th",
  FRIDAY = "F",
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
  isLecturerApproved: boolean;
  isTaAccepted: boolean;
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
  id: string;
  isLecturerApproved: boolean;
  isTaAccepted: boolean;
  isWorkforceApproved: boolean;
  activityId: string;
  staffId: string;
  activity: IActivity;
}
