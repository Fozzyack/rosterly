"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { createRosterDraft, createTeamMember, createTimeOff, getRoster, getSchedulingProfile, getTimeOff, getWorkspace, publishRoster, reviewTimeOff, saveRoster, saveSchedulingProfile } from "@/lib/roster-client";
import { dateKey, formatHours, mondayFor, rosterEmployees, rosterShifts, shiftHours, weekDates, type Employee, type Role, type Shift } from "@/lib/roster";
import type { OpenShift, Roster, RosterDraft, SchedulingProfile, TeamMember, TimeOffRequest, Workspace } from "@/types/roster";
import { LogoMark } from "../components/site-header";
import { ROLE_COLORS } from "./data";
import styles from "./dashboard.module.css";
import { Icon } from "./icons";
import { RosterTable } from "./roster-table";
import { DraftRosterDialog, SchedulingProfileDialog } from "./scheduling-dialog";
import { DAYS, Dialog, ShiftDialog, type ShiftSelection } from "./shift-dialog";

const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-full border border-[#d9dcd0] bg-white/80 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#f0f3e8]";
const primaryButton = "inline-flex items-center justify-center gap-2 rounded-full bg-[#17211e] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#334b3d] disabled:cursor-default disabled:opacity-50";

function emptyRoster(weekStart: string): Roster {
  return { week_start: weekStart, published: false, shifts: [] };
}

export function Dashboard() {
  const router = useRouter();
  const [weekOffset, setWeekOffset] = useState(0);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [members, setMembers] = useState<Employee[]>([]);
  const [roster, setRoster] = useState<Roster>();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "All roles">("All roles");
  const [selection, setSelection] = useState<ShiftSelection | null>(null);
  const [dialog, setDialog] = useState<"team" | "profile" | "draft" | "publish" | "timeOff" | null>(null);
  const [timeOff, setTimeOff] = useState<TimeOffRequest[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileMember, setProfileMember] = useState<TeamMember>();
  const [profile, setProfile] = useState<SchedulingProfile>();
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [draft, setDraft] = useState<RosterDraft>();
  const [drafting, setDrafting] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const weekStart = dateKey(mondayFor(weekOffset));
  const dates = weekDates(weekStart);

  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);
  useEffect(() => {
    let cancelled = false;
    Promise.all([getWorkspace(), getRoster(weekStart), getTimeOff()])
      .then(([workspaceData, rosterData, timeOffData]) => {
        if (cancelled) return;
        setWorkspace(workspaceData.workspace);
        setMembers(rosterEmployees(workspaceData.members, rosterData));
        setRoster(rosterData);
        setTimeOff(timeOffData);
        setDraft(undefined);
      })
      .catch((cause: unknown) => { if (!cancelled) setError(cause instanceof Error ? cause.message : "Could not load the roster."); })
      .finally(() => undefined);
    return () => { cancelled = true; };
  }, [weekStart]);

  function notify(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 6000);
  }

  async function persist(nextMembers: Employee[], success: string): Promise<string | undefined> {
    setSaving(true);
    setError("");
    try {
      const saved = await saveRoster(weekStart, rosterShifts(nextMembers, dates));
      setRoster(saved);
      setMembers(rosterEmployees(nextMembers, saved));
      setSelection(null);
      notify(success);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Could not save the roster.";
      setError(message);
      return message;
    } finally {
      setSaving(false);
    }
  }

  async function saveShift(employeeId: string, shift: Shift): Promise<string | undefined> {
    if (shiftHours(shift) <= 0) return "Choose an end time after the start time. Overnight shifts aren’t supported.";
    const person = members.find((member) => member.id === employeeId);
    if (!person) return "Choose a team member.";
    const minutes = (time: string) => { const [hours, minutes] = time.split(":").map(Number); return hours * 60 + minutes; };
    const overlaps = person.shifts.some((existing, index) => !(selection?.employeeId === employeeId && selection.shiftIndex === index) && existing.day === shift.day && minutes(shift.start) < minutes(existing.end) && minutes(shift.end) > minutes(existing.start));
    if (overlaps) return `${person.name} already has a shift during those hours.`;
    const nextMembers = members.map((member) => {
      const remaining = member.id === selection?.employeeId ? member.shifts.filter((_, index) => index !== selection.shiftIndex) : member.shifts;
      return { ...member, shifts: member.id === employeeId ? [...remaining, shift] : remaining };
    });
    return persist(nextMembers, `Shift saved for ${person.name}.`);
  }

  async function deleteShift() {
    if (!selection?.employeeId || selection.shiftIndex === undefined) return;
    await persist(members.map((member) => member.id === selection.employeeId ? { ...member, shifts: member.shifts.filter((_, index) => index !== selection.shiftIndex) } : member), "Shift removed. Your weekly totals are up to date.");
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    try {
      const member = await createTeamMember({ name: String(form.get("name")).trim(), email: String(form.get("email")).trim() });
      const nextRoster = roster ?? emptyRoster(weekStart);
      setMembers(rosterEmployees([...members, member], nextRoster));
      setDialog(null);
      notify(`${member.name} has joined your team.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add the team member.");
    } finally { setSaving(false); }
  }

  async function openProfile(member: TeamMember) {
    setProfileMember(member);
    setProfile(undefined);
    setProfileError("");
    setProfileLoading(true);
    setDialog("profile");
    try { setProfile(await getSchedulingProfile(member.id)); }
    catch (cause) { setProfileError(cause instanceof Error ? cause.message : "Could not load the scheduling profile."); }
    finally { setProfileLoading(false); }
  }

  async function saveProfile(nextProfile: Pick<SchedulingProfile, "roles" | "availability">) {
    if (!profileMember) return;
    setProfileSaving(true);
    setProfileError("");
    try {
      await saveSchedulingProfile(profileMember.id, nextProfile);
      setDialog("team");
      notify(`Scheduling profile saved for ${profileMember.name}.`);
    } catch (cause) { setProfileError(cause instanceof Error ? cause.message : "Could not save the scheduling profile."); }
    finally { setProfileSaving(false); }
  }

  async function generateDraft(openShifts: OpenShift[]) {
    if (currentRoster.published) return "Published rosters cannot be changed.";
    setDrafting(true);
    setError("");
    try { setDraft(await createRosterDraft(weekStart, openShifts)); }
    catch (cause) { return cause instanceof Error ? cause.message : "Could not generate a roster draft."; }
    finally { setDrafting(false); }
  }

  async function applyDraft(): Promise<string | undefined> {
    if (!draft || draft.week_start !== weekStart || currentRoster.published) return "This draft can no longer be applied.";
    setSaving(true);
    setError("");
    try {
      const saved = await saveRoster(weekStart, [...draft.manual_shifts, ...draft.generated_shifts]);
      setRoster(saved);
      setMembers(rosterEmployees(members, saved));
      setDraft(undefined);
      setDialog(null);
      notify("Draft applied and roster saved. Review it before publishing.");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Could not apply the roster draft.";
      setError(message);
      return message;
    }
    finally { setSaving(false); }
  }

  async function refreshTimeOff() {
    const requests = await getTimeOff();
    setTimeOff(requests);
  }

  async function addTimeOff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    try {
      await createTimeOff({
        team_member_id: String(form.get("teamMember")),
        start_date: String(form.get("startDate")),
        end_date: String(form.get("endDate")),
        reason: String(form.get("reason")).trim(),
      });
      await refreshTimeOff();
      setDialog(null);
      notify("Time-off request created.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the time-off request.");
    } finally { setSaving(false); }
  }

  async function review(requestId: string, status: "approved" | "rejected") {
    setSaving(true);
    setError("");
    try {
      await reviewTimeOff(requestId, { status });
      await refreshTimeOff();
      notify(`Time off ${status}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not review the time-off request.");
    } finally { setSaving(false); }
  }

  async function publish() {
    setSaving(true);
    try {
      const published = await publishRoster(weekStart);
      setRoster(published);
      setMembers(rosterEmployees(members, published));
      setDialog(null);
      notify("Your roster is published. Your week, sorted.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not publish the roster."); }
    finally { setSaving(false); }
  }

  async function logOut() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); }
  function exportRoster() {
    const rows = [["Employee", "Date", "Role", "Start", "End", "Hours"], ...members.flatMap((person) => person.shifts.map((shift) => [person.name, dateKey(dates[shift.day]), shift.role, shift.start, shift.end, String(shiftHours(shift))]))];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `rosterly-${weekStart}.csv`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); notify("Your weekly roster has been exported.");
  }

  const currentRoster = roster ?? emptyRoster(weekStart);
  const loading = roster?.week_start !== weekStart;
  const shifts = members.flatMap((person) => person.shifts);
  const hours = shifts.reduce((sum, shift) => sum + shiftHours(shift), 0);
  const scheduledTeam = members.filter((person) => person.shifts.length > 0);
  const dailyHours = DAYS.map((_, day) => shifts.filter((shift) => shift.day === day).reduce((sum, shift) => sum + shiftHours(shift), 0));
  const maxDailyHours = Math.max(...dailyHours, 1);
  const filteredMembers = members.filter((person) => person.name.toLowerCase().includes(query.toLowerCase()) && (role === "All roles" || person.shifts.some((shift) => shift.role === role)));
  const dateRange = `${dates[0].toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })} – ${dates[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
  const memberNames = new Map(members.map((member) => [member.id, member.name]));
  const pendingTimeOff = timeOff.filter((request) => request.status === "pending");
  const timeOffDate = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  return <div className={`${styles.shell} min-h-screen bg-[#f5f3ea] font-sans text-[#17211e]`}>
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[222px] flex-col bg-[#1c2a23] text-[#eef1e9] lg:flex"><Link href="/" className="flex items-center gap-2.5 px-7 py-8"><LogoMark /><span className="text-[25px] font-semibold tracking-[-0.06em]">rosterly<span className="text-[#d9ff57]">.</span></span></Link><div className="mx-4 rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-xs font-medium">{workspace?.name ?? "Your workspace"}</p><p className="mt-1 text-[10px] text-[#a0ad9f]">A little team, a lot of heart</p></div><nav className="mt-8 space-y-1 px-4"><a href="#roster" className="flex items-center gap-3 rounded-xl bg-[#d9ff57] px-3 py-3 text-[13px] font-medium text-[#23301f]"><Icon name="calendar" />Weekly roster</a><button type="button" onClick={() => setDialog("team")} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-[#b4c1b4] hover:bg-white/5 hover:text-white"><Icon name="team" />My team</button></nav><button type="button" onClick={logOut} className="mx-6 mb-6 mt-auto text-left text-xs font-semibold text-[#b4c1b4] hover:text-white">Log out</button></aside>
    <div className="lg:pl-[222px]"><header className="flex min-h-[76px] items-center justify-between border-b border-[#dfdfd4] px-5 sm:px-8 xl:px-10"><Link href="/" className="flex items-center gap-2 text-lg font-semibold sm:hidden"><LogoMark small />rosterly</Link><span className="hidden text-xs text-[#68725f] sm:block">{workspace?.name ?? "Workspace"}</span><span className="rounded-full border border-[#d9dcd0] px-2.5 py-1 text-[10px] font-medium text-[#68725f]">Saved workspace</span></header>
      <main className="mx-auto max-w-[1600px] px-5 pb-6 pt-8 sm:px-8 xl:px-10"><section className={styles.enter}><div className="flex flex-wrap items-center justify-between gap-5"><div><p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#7d8775]">A fresh perspective on your week</p><h1 className="text-[clamp(1.9rem,3.1vw,2.8rem)] font-semibold tracking-[-0.06em]">Your roster<span className="text-[#8ca368]">.</span></h1><p className="mt-2 text-[13px] text-[#74806d]">A happy team starts with a well-planned week.</p></div><div className="flex gap-2.5"><button type="button" onClick={exportRoster} disabled={loading} className={secondaryButton}><Icon name="export" className="size-4" />Export</button><button type="button" onClick={() => setDialog("publish")} disabled={loading || saving || currentRoster.published || !shifts.length} className="inline-flex items-center gap-2 rounded-full bg-[#d9ff57] px-5 py-3 text-xs font-semibold disabled:opacity-60"><Icon name="check" className="size-4" />{currentRoster.published ? "Roster published" : "Publish roster"}</button></div></div>
        <div className={`${styles.stats} mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4`}><div className="rounded-2xl border border-[#dfe2d4] bg-[#eef1e4] p-5"><p className="text-xs text-[#65735a]">Scheduled hours</p><p className="mt-4 text-[34px] font-semibold tracking-[-0.06em]">{formatHours(hours)}</p></div><div className="rounded-2xl border border-[#e1e2d8] bg-white/80 p-5"><p className="text-xs text-[#73806b]">Team scheduled</p><p className="mt-4 text-[34px] font-semibold tracking-[-0.06em]">{scheduledTeam.length}<span className="text-base font-normal text-[#9ba38f]"> / {members.length}</span></p></div><div className="rounded-2xl border border-[#e1e2d8] bg-white/80 p-5"><p className="text-xs text-[#73806b]">Roster status</p><p className="mt-4 text-lg font-semibold">{currentRoster.published ? "Published" : "Draft"}</p></div><div className="rounded-2xl border border-[#e1e2d8] bg-white/80 p-5"><p className="text-xs text-[#73806b]">Shifts this week</p><p className="mt-4 text-[34px] font-semibold tracking-[-0.06em]">{shifts.length}</p></div></div></section>
        {error && <div role="alert" className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#edc6b5] bg-[#fff1e9] p-4 text-sm text-[#914b2d]"><span>{error}</span><button type="button" onClick={() => setError("")} aria-label="Dismiss error"><Icon name="close" /></button></div>}
        <section id="roster" className={`${styles.roster} mt-7 overflow-hidden rounded-[20px] border border-[#dfe1d4] bg-[#fdfefa]`}><div className="flex flex-wrap items-center justify-between gap-4 px-5 pb-5 pt-6 sm:px-6"><div><h2 className="text-lg font-semibold">Your weekly roster</h2><p className="mt-1 text-[11px] text-[#849078]">{dateRange}</p></div><div className="flex gap-2"><button type="button" onClick={() => setDialog("draft")} disabled={loading || !members.length || currentRoster.published} className={secondaryButton}>Build draft</button><button type="button" onClick={() => setSelection({})} disabled={loading || !members.length} className={primaryButton}><Icon name="plus" className="size-4" />Add shift</button></div></div><div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-5 sm:px-6"><div className="flex items-center rounded-lg border border-[#e0e3d7] bg-white p-0.5"><button type="button" disabled={saving} onClick={() => setWeekOffset((value) => value - 1)} className="grid size-8 place-items-center"><Icon name="chevron" className="size-3.5 rotate-180" /></button><p className="min-w-[156px] text-center text-[11px] font-medium">{dateRange}</p><button type="button" disabled={saving} onClick={() => setWeekOffset((value) => value + 1)} className="grid size-8 place-items-center"><Icon name="chevron" className="size-3.5" /></button></div><button type="button" disabled={saving} onClick={() => setWeekOffset(0)} className={secondaryButton}>Current week</button><label className="flex items-center gap-2 rounded-lg border border-[#e0e3d7] bg-white px-3 py-2.5"><Icon name="search" className="size-3.5" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a teammate" className="w-32 bg-transparent text-[10px] outline-none" /></label></div>
          {loading ? <p className="p-10 text-center text-sm text-[#707a70]">Loading your roster…</p> : !members.length ? <div className="p-10 text-center"><p className="text-base font-semibold">Start with your team.</p><p className="mt-2 text-sm text-[#707a70]">Add a team member before scheduling your first shift.</p><button type="button" onClick={() => setDialog("team")} className={`${primaryButton} mt-5`}>Add team member</button></div> : <><div className="flex justify-end px-5 pb-3"><select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-lg border border-[#e0e3d7] bg-white px-3 py-2 text-[10px]"><option>All roles</option>{Object.keys(ROLE_COLORS).map((item) => <option key={item}>{item}</option>)}</select></div><RosterTable employees={filteredMembers} dates={dates} onSelect={setSelection} /></>}<div className="flex flex-wrap gap-4 border-t border-[#e5e6de] px-5 py-4">{Object.entries(ROLE_COLORS).map(([name, color]) => <span key={name} className="flex items-center gap-1.5 text-[9px] text-[#7b8771]"><span className={`size-1.5 rounded-full ${color.dot}`} />{name}</span>)}</div></section>
        <section className="mt-5 grid gap-5 xl:grid-cols-2"><div className="rounded-[20px] border border-[#dfe1d4] bg-[#fdfefa] p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold">Time off</h2><p className="mt-1 text-[11px] text-[#74806d]">{pendingTimeOff.length ? `${pendingTimeOff.length} awaiting review` : "No requests awaiting review"}</p></div><button type="button" disabled={!members.length} onClick={() => setDialog("timeOff")} className={secondaryButton}><Icon name="plus" className="size-3.5" />Request</button></div><div className="mt-4 space-y-3">{timeOff.slice(0, 3).map((request) => <div key={request.id} className="rounded-xl border border-[#e2e5d8] bg-white p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold">{memberNames.get(request.team_member_id) ?? "Former team member"}</p><p className="mt-1 text-[10px] text-[#7c886f]">{timeOffDate(request.start_date)}{request.end_date !== request.start_date && ` – ${timeOffDate(request.end_date)}`}{request.reason && ` · ${request.reason}`}</p></div><span className={`text-[10px] font-medium ${request.status === "approved" ? "text-[#658247]" : request.status === "rejected" ? "text-[#a26f50]" : "text-[#8e805a]"}`}>{request.status}</span></div>{request.status === "pending" && <div className="mt-3 flex gap-2"><button type="button" disabled={saving} onClick={() => review(request.id, "rejected")} className="text-[10px] font-medium text-[#a64e38] hover:underline">Reject</button><button type="button" disabled={saving} onClick={() => review(request.id, "approved")} className="text-[10px] font-medium text-[#658247] hover:underline">Approve</button></div>}</div>)}{!timeOff.length && <p className="py-3 text-sm text-[#74806d]">No time-off requests yet.</p>}</div></div><div className="rounded-[20px] border border-[#d9dfc9] bg-[#edf1e2] p-6"><h2 className="text-base font-semibold">The shape of your week</h2><div className="mt-5 flex h-24 items-end gap-3">{dailyHours.map((value, day) => <div key={DAYS[day]} className="flex flex-1 flex-col items-center gap-1"><div className="w-full max-w-9 rounded-t bg-[#839f5b]" style={{ height: `${Math.max(3, value / maxDailyHours * 67)}px` }} /><span className="text-[9px] text-[#7e8b6d]">{DAYS[day]}</span></div>)}</div></div></section>
        <footer className="mt-6 text-center text-[9px] text-[#949d88]">Rosterly © 2026 · Changes are saved to your workspace</footer></main></div>
    {notice && <div role="status" className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl bg-[#233628] px-5 py-4 text-sm text-white">{notice}</div>}
    {selection && <ShiftDialog selection={selection} employees={members} dates={dates} onClose={() => setSelection(null)} onSave={saveShift} onDelete={deleteShift} />}
    {dialog === "team" && <Dialog title="Good people. Great team." onClose={() => setDialog(null)}><p className="-mt-3 mb-5 text-sm text-[#7c886f]">Add your team, then set who can cover each role and when.</p><div className="space-y-2">{members.map((person) => <div key={person.id} className="flex items-center gap-3 rounded-xl border border-[#e2e5d8] bg-white p-3"><span className={`grid size-10 place-items-center rounded-full text-xs font-semibold ${person.color}`}>{person.initials}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{person.name}</p><p className="truncate text-xs text-[#7c886f]">{person.email || "No email added"}</p></div><button type="button" onClick={() => void openProfile(person)} className="text-xs font-semibold text-[#55715e] hover:underline">Scheduling</button></div>)}</div><form onSubmit={addMember} className="mt-5 space-y-3 border-t border-[#e3e4db] pt-5"><input name="name" required placeholder="Team member name" className="w-full rounded-xl border border-[#d6d9cf] bg-white px-3 py-3 text-sm" /><input name="email" type="email" placeholder="Email address (optional)" className="w-full rounded-xl border border-[#d6d9cf] bg-white px-3 py-3 text-sm" /><button disabled={saving} className={`${primaryButton} w-full`}>Add team member</button></form></Dialog>}
    {dialog === "profile" && profileMember && <SchedulingProfileDialog member={profileMember} profile={profile} loading={profileLoading} saving={profileSaving} error={profileError} onClose={() => setDialog("team")} onSave={saveProfile} />}
    {dialog === "draft" && <DraftRosterDialog weekStart={weekStart} dates={dates} members={members} draft={draft} generating={drafting} applying={saving} onClose={() => setDialog(null)} onGenerate={generateDraft} onApply={applyDraft} />}
    {dialog === "timeOff" && <Dialog title="A little time away." onClose={() => setDialog(null)}><p className="-mt-3 mb-5 text-sm text-[#7c886f]">Record a request, then review it from the dashboard.</p><form onSubmit={addTimeOff} className="space-y-4"><label className="block text-xs font-semibold">Team member<select name="teamMember" required className="mt-2 block w-full rounded-xl border border-[#d6d9cf] bg-white px-3 py-3 text-sm">{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><div className="grid grid-cols-2 gap-4"><label className="block text-xs font-semibold">Starts<input name="startDate" type="date" required className="mt-2 block w-full rounded-xl border border-[#d6d9cf] bg-white px-3 py-3 text-sm" /></label><label className="block text-xs font-semibold">Ends<input name="endDate" type="date" required className="mt-2 block w-full rounded-xl border border-[#d6d9cf] bg-white px-3 py-3 text-sm" /></label></div><label className="block text-xs font-semibold">Reason<textarea name="reason" required rows={3} className="mt-2 block w-full rounded-xl border border-[#d6d9cf] bg-white px-3 py-3 text-sm" /></label><button disabled={saving} className={`${primaryButton} w-full`}>Create request</button></form></Dialog>}
    {dialog === "publish" && <Dialog title="Ready to call it a plan?" onClose={() => setDialog(null)}><div className="rounded-2xl bg-[#edf1e2] p-5"><p className="text-sm font-semibold">{dateRange}</p><p className="mt-2 text-xs text-[#7c886f]">{shifts.length} assigned shifts · {formatHours(hours)} · {scheduledTeam.length} teammates</p></div><p className="mt-5 text-sm leading-6 text-[#738069]">Publishing makes this roster available to your team.</p><button type="button" disabled={saving} onClick={publish} className={`${primaryButton} mt-6 w-full`}>Publish roster</button></Dialog>}
  </div>;
}
