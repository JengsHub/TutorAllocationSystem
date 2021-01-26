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
  allocations: IAllocationWithStaff[];
  campus: string;
  dayOfWeek: DayOfWeek;
  id: string;
  location: string;
  startTime: string;
  endTime: string;
  studentCount: number;
  unit: IUnit;
  unitId: string;
  allocationsMaxNum: number;
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
  activity: IActivity;
  staffId: string;
  staff: IStaff;
  approval: ApprovalEnum;
  isLecturerApproved: boolean;
  isTaAccepted: boolean;
  isWorkforceApproved: boolean;
  offerExpiryDate: string;
}

interface IAllocationWithStaff {
  id: string;
  activityId: string;
  staffId: string;
  staff: IStaff;
  approval: ApprovalEnum;
  isLecturerApproved: boolean;
  isTaAccepted: boolean;
  isWorkforceApproved: boolean;
  offerExpiryDate: string;
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

interface IStatusLogWithStaff {
  id: string;
  allocation_id: string;
  action: string;
  staff: IStaff;
  staffId: string;
  time: string;
}

interface ISwap {
  lecturerApproved: boolean;
  workforceApproved: boolean;
  id: string;
  fromAllocationId: string;
  intoAllocationId: string | null;
  desiredActivityId: string;
  from: IAllocation;
  into: IAllocation | null;
  desired: IActivity;
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
