import type { Roster, RosterShift, TeamMember } from "@/types/roster";

export type Role = string;

export type Shift = {
  id?: string;
  day: number;
  start: string;
  end: string;
  role: Role;
};

export type Employee = TeamMember & {
  initials: string;
  color: string;
  shifts: Shift[];
};

const avatarColors = ["bg-[#d9ff57]", "bg-[#dbe7fe]", "bg-[#fde2cf]", "bg-[#e9dcfd]", "bg-[#d6f3e6]"];

export function mondayFor(offset = 0): Date {
  const today = new Date();
  const monday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7) + offset * 7);
  return monday;
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function weekDates(weekStart: string): Date[] {
  const start = new Date(`${weekStart}T00:00:00Z`);
  return Array.from({ length: 7 }, (_, day) => new Date(start.getTime() + day * 86_400_000));
}

export function rosterEmployees(members: TeamMember[], roster: Roster): Employee[] {
  return members.map((member, index) => ({
    ...member,
    initials: member.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    color: avatarColors[index % avatarColors.length],
    shifts: roster.shifts
      .filter((shift) => shift.team_member_id === member.id)
      .map((shift) => ({ ...shift, day: Math.round((new Date(`${shift.date}T00:00:00Z`).getTime() - new Date(`${roster.week_start}T00:00:00Z`).getTime()) / 86_400_000) })),
  }));
}

export function rosterShifts(employees: Employee[], dates: Date[]): RosterShift[] {
  return employees.flatMap((employee) => employee.shifts.map((shift) => ({
    id: shift.id,
    team_member_id: employee.id,
    date: dateKey(dates[shift.day]),
    start: shift.start,
    end: shift.end,
    role: shift.role,
  })));
}

export function shiftHours(shift: { start: string; end: string }): number {
  const [sh, sm] = shift.start.split(":").map(Number);
  const [eh, em] = shift.end.split(":").map(Number);
  return eh + em / 60 - (sh + sm / 60);
}

export function formatHours(hours: number): string {
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}
