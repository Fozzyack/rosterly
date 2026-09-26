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
