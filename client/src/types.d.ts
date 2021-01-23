type State = {
  dragging: boolean;
  file: File | null;
};

type Props = {};

type PresentationalProps = {
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

interface Units {
  unitCode: string;
  offeringPeriod: string;
  campus: string;
  year: number;
  aqfTarget: number;
}

interface Staff {
  givenNames: string;
  lastName: string;
  aqf: number;
  studyingAqf: number;
  email: string;
}

interface StaffPreference {
  preferenceScore: number;
  lecturerScore: number;
  isHeadTutorCandidate: boolean;
  staffId: string;
  unitId: string;
}

interface Availability {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  year: number;
  maxHours: number;
  maxNumberActivities: number;
  staffId: string;
}

interface Activity {
  activityCode: string;
  activityGroup: string;
  campus: string;
  location: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  unitId: string;
}

interface Allocation {
  activityId: string;
  staffId: string;
}
