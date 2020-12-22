export enum DayOfWeek {
  MONDAY = "M",
  TUESDAY = "T",
  WEDNESDAY = "W",
  THURSDAY = "Th",
  FRIDAY = "F",
}
export interface IUnits {
  unitCode: string;
  offeringPeriod: string;
  campus: string;
  year: number;
  aqfTarget: number;
}

export interface IStaff {
  givenNames: string;
  lastName: string;
  aqf: number;
  studyingAqf: number;
  email: string;
}

export interface IStaffPreference {
  preferenceScore: number;
  lecturerScore: number;
  isHeadTutorCandidate: boolean;
  staffId: string;
  unitId: string;
}

export interface IAvailability {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  year: number;
  maxHours: number;
  maxNumberActivities: number;
  staffId: string;
}

export interface IActivity {
  activityCode: string;
  activityGroup: string;
  campus: string;
  location: string;
  duration: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  unitId: string;
}

export interface IAllocation {
  activityId: string;
  staffId: string;
}
