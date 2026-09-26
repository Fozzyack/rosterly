export type Workspace = { id: string; name: string };

export type TeamMember = {
  id: string;
  name: string;
  email: string;
};

export type RosterShift = {
  id?: string;
  team_member_id: string;
  date: string;
  start: string;
  end: string;
  role: string;
};

export type Roster = {
  week_start: string;
  published: boolean;
  shifts: RosterShift[];
};

export type Availability = {
  weekday: number;
  start: string;
  end: string;
};

export type SchedulingProfile = {
  team_member_id: string;
  roles: string[];
  availability: Availability[];
};

export type OpenShift = {
  date: string;
  start: string;
  end: string;
  role: string;
};

export type RosterDraft = {
  week_start: string;
  manual_shifts: RosterShift[];
  generated_shifts: RosterShift[];
  unfilled_shifts: OpenShift[];
};

export type WorkspaceResponse = {
  workspace: Workspace;
  members: TeamMember[];
};

export type TimeOffRequest = {
  id: string;
  team_member_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type CreateTimeOffRequest = Pick<TimeOffRequest, "team_member_id" | "start_date" | "end_date" | "reason">;

export type ReviewTimeOffRequest = Pick<TimeOffRequest, "status">;
