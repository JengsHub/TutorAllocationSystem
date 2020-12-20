export type State = {
  dragging: boolean;
  file: File | null;
};

export type Props = {};

export type PresentationalProps = {
  dragging: boolean;
  file: File | null;
  onDrag: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
};

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

export export interface IActivity {
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
