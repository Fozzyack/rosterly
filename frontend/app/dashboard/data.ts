//
//
//
// Sample Data for the dashboard
//
//
//


export type Role = "Manager" | "Barista" | "Chef" | "Server" | "Cleaner";

export type Shift = {
  day: number; // 0 = Monday … 6 = Sunday
  start: string;
  end: string;
  role: Role;
};

export type Employee = {
  id: string;
  name: string;
  initials: string;
  color: string; // avatar background
  shifts: Shift[];
  timeOff?: number[]; // day indexes
};

export type OpenShift = {
  day: number;
  start: string;
  end: string;
  role: Role;
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  employee: string;
  initials: string;
  color: string;
  kind: "Time off" | "Shift swap";
  detail: string;
  date: string;
  weekOffset: number;
  days?: number[];
};

export const ROLE_COLORS: Record<Role, { chip: string; dot: string }> = {
  Manager: { chip: "bg-[#d9ff57]/50 border-[#b8dd3e]", dot: "bg-[#9dc41e]" },
  Barista: { chip: "bg-[#dbe7fe] border-[#a8c3f5]", dot: "bg-[#5b8def]" },
  Chef: { chip: "bg-[#fde2cf] border-[#f4b98a]", dot: "bg-[#e8823c]" },
  Server: { chip: "bg-[#e9dcfd] border-[#cfb2f5]", dot: "bg-[#9a6ae8]" },
  Cleaner: { chip: "bg-[#d6f3e6] border-[#9fdcbe]", dot: "bg-[#3da87a]" },
};

export const EMPLOYEES: Employee[] = [
  {
    id: "alex-smith",
    name: "Alex Smith",
    initials: "AS",
    color: "bg-[#d9ff57]",
    shifts: [
      { day: 0, start: "9:00", end: "17:00", role: "Manager" },
      { day: 2, start: "9:00", end: "17:00", role: "Manager" },
      { day: 3, start: "9:00", end: "17:00", role: "Manager" },
      { day: 4, start: "9:00", end: "17:00", role: "Manager" },
    ],
  },
  {
    id: "sam-lee",
    name: "Sam Lee",
    initials: "SL",
    color: "bg-[#dbe7fe]",
    shifts: [
      { day: 0, start: "7:00", end: "15:00", role: "Barista" },
      { day: 1, start: "7:00", end: "15:00", role: "Barista" },
      { day: 2, start: "7:00", end: "15:00", role: "Barista" },
      { day: 3, start: "7:00", end: "15:00", role: "Barista" },
      { day: 4, start: "7:00", end: "15:00", role: "Barista" },
    ],
    timeOff: [5],
  },
  {
    id: "john-smith",
    name: "John Smith",
    initials: "JS",
    color: "bg-[#fde2cf]",
    shifts: [
      { day: 1, start: "10:00", end: "18:00", role: "Chef" },
      { day: 2, start: "10:00", end: "18:00", role: "Chef" },
      { day: 4, start: "10:00", end: "18:00", role: "Chef" },
      { day: 5, start: "10:00", end: "18:00", role: "Chef" },
    ],
  },
  {
    id: "jane-doe",
    name: "Jane Doe",
    initials: "JD",
    color: "bg-[#e9dcfd]",
    shifts: [
      { day: 0, start: "12:00", end: "20:00", role: "Server" },
      { day: 1, start: "12:00", end: "20:00", role: "Server" },
      { day: 3, start: "12:00", end: "20:00", role: "Server" },
      { day: 4, start: "12:00", end: "20:00", role: "Server" },
      { day: 5, start: "12:00", end: "20:00", role: "Server" },
      { day: 6, start: "12:00", end: "20:00", role: "Server" },
    ],
  },
  {
    id: "wendy-smith",
    name: "Wendy Smith",
    initials: "WS",
    color: "bg-[#d6f3e6]",
    shifts: [
      { day: 2, start: "6:00", end: "14:00", role: "Cleaner" },
      { day: 5, start: "6:00", end: "14:00", role: "Cleaner" },
    ],
    timeOff: [0, 1],
  },
];

export const OPEN_SHIFTS: OpenShift[] = [
  { day: 1, start: "16:00", end: "22:00", role: "Server" },
  { day: 4, start: "16:00", end: "22:00", role: "Server" },
  { day: 6, start: "9:00", end: "15:00", role: "Barista" },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "req-1",
    employeeId: "sam-lee",
    employee: "Sam Lee",
    initials: "SL",
    color: "bg-[#dbe7fe]",
    kind: "Shift swap",
    detail: "Wants to swap Friday 7:00 – 15:00",
    date: "Fri 18 Sep",
    weekOffset: 0,
  },
  {
    id: "req-2",
    employeeId: "jane-doe",
    employee: "Jane Doe",
    initials: "JD",
    color: "bg-[#e9dcfd]",
    kind: "Time off",
    detail: "Requested 2 days off next week",
    date: "Thu 24 – Fri 25 Sep",
    weekOffset: 1,
    days: [3, 4],
  },
  {
    id: "req-3",
    employeeId: "wendy-smith",
    employee: "Wendy Smith",
    initials: "WS",
    color: "bg-[#d6f3e6]",
    kind: "Time off",
    detail: "Requested the day off for an appointment",
    date: "Wed 23 Sep",
    weekOffset: 1,
    days: [2],
  },
];

export function shiftHours(shift: { start: string; end: string }): number {
  const [sh, sm] = shift.start.split(":").map(Number);
  const [eh, em] = shift.end.split(":").map(Number);
  return eh + em / 60 - (sh + sm / 60);
}

export function formatHours(hours: number): string {
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}
