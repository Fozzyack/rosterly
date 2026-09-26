import type { CreateTimeOffRequest, ReviewTimeOffRequest, Roster, TeamMember, TimeOffRequest, WorkspaceResponse } from "@/types/roster";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/roster/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? "The roster service could not complete that request.");
  }
  return response.json() as Promise<T>;
}

export const getWorkspace = () => request<WorkspaceResponse>("workspace");
export const getRoster = (week: string) => request<Roster>(`rosters/${week}`);
export const saveRoster = (week: string, shifts: Roster["shifts"]) => request<Roster>(`rosters/${week}`, { method: "PUT", body: JSON.stringify({ shifts }) });
export const publishRoster = (week: string) => request<Roster>(`rosters/${week}/publish`, { method: "POST" });
export const createTeamMember = (member: Pick<TeamMember, "name" | "email">) => request<TeamMember>("team-members", { method: "POST", body: JSON.stringify(member) });
export const getTimeOff = () => request<TimeOffRequest[]>("time-off");
export const createTimeOff = (timeOff: CreateTimeOffRequest) => request<TimeOffRequest>("time-off", { method: "POST", body: JSON.stringify(timeOff) });
export const reviewTimeOff = (requestId: string, review: ReviewTimeOffRequest) => request<TimeOffRequest>(`time-off/${requestId}/review`, { method: "POST", body: JSON.stringify(review) });
