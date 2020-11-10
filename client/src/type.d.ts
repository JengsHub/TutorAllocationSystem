interface IActivity {
  activityCode: string;
  activityGroup: string;
  allocations: IAllocation[];
  campus: string;
  dayOfWeek: string;
  duration: number;
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
}

interface IAllocation {
  id: string;
  activityId: string;
  staffId: string;
}

interface IAvailability {
  id: string;
  day: string;
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
