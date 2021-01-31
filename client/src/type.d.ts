import { RoleEnum } from "./enums/RoleEnum";

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

export interface IUnit {
  id: string;
  unitCode: string;
  offeringPeriod: string;
  campus: string;
  year: number;
  aqfTarget: number;
}

enum DayOfWeek {
  MONDAY = "M",
  TUESDAY = "T",
  WEDNESDAY = "W",
  THURSDAY = "Th",
  FRIDAY = "F",
}

export interface IActivity {
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

export interface IStaff {
  aqf: number;
  email: string;
  givenNames: string;
  id: string;
  lastName: string;
  studyingAqf: number;
}

export interface IRole {
  id: string;
  title: RoleEnum;
  unit: IUnit;
  unitId: string;
  staff: IStaff;
  staffId: string;
}

export interface IPreference {
  id;
  string;
  isHeadTutorCandidate: true;
  lecturerScore: number;
  preferenceScore: number;
  staffId: string;
  unitId: string;
  staff: IStaff;
  unit: IUnit;
}

export interface IAllocation {
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

export interface IAllocationWithStaff {
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

export interface IAvailability {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  year: number;
  maxHours: number;
  maxNumberActivities: number;
  staffId: string;
}

export interface IRule {
  id: string;
  ruleName: string;
  ruleDescription: string;
  value: number;
}

export interface IStatusLogWithStaff {
  id: string;
  allocation_id: string;
  action: string;
  staff: IStaff;
  staffId: string;
  targetStaff: IStaff;
  targetStaffId: string;
  time: string;
}

export interface ISwap {
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
