"use client";

import { useState } from "react";

import type { Availability, OpenShift, RosterDraft, SchedulingProfile, TeamMember } from "@/types/roster";
import { ROLE_COLORS } from "./data";
import { Dialog } from "./shift-dialog";

const fieldClass = "mt-2 block w-full rounded-xl border border-[#d6d9cf] bg-white px-3 py-3 text-sm outline-none focus:border-[#55715e] focus:ring-2 focus:ring-[#d9ff57]";
const primaryButton = "inline-flex items-center justify-center rounded-full bg-[#17211e] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#334b3d] disabled:cursor-default disabled:opacity-50";
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SchedulingProfileDialog({ member, profile, loading, saving, error, onClose, onSave }: {
  member: TeamMember;
  profile?: SchedulingProfile;
  loading: boolean;
  saving: boolean;
  error?: string;
  onClose: () => void;
  onSave: (profile: Pick<SchedulingProfile, "roles" | "availability">) => Promise<void>;
}) {
  return <Dialog title={`Schedule ${member.name}`} onClose={onClose}>
    <p className="-mt-3 mb-5 text-sm leading-6 text-[#7c886f]">Set the roles they can cover and the hours they are regularly available. These preferences guide draft generation.</p>
    {loading ? <p className="py-8 text-center text-sm text-[#707a70]">Loading scheduling profile...</p> : <>{error && <p role="alert" className="mb-4 rounded-xl bg-[#fde2cf] p-3 text-sm text-[#854b23]">{error}</p>}{profile && <SchedulingProfileForm key={profile.team_member_id} profile={profile} saving={saving} onSave={onSave} />}</>}
  </Dialog>;
}

function SchedulingProfileForm({ profile, saving, onSave }: {
  profile: SchedulingProfile;
  saving: boolean;
  onSave: (profile: Pick<SchedulingProfile, "roles" | "availability">) => Promise<void>;
}) {
  const [value, setValue] = useState(profile);

  function toggleRole(role: string) {
    setValue((current) => ({ ...current, roles: current.roles.includes(role) ? current.roles.filter((item) => item !== role) : [...current.roles, role] }));
  }

  function updateAvailability(index: number, field: keyof Availability, next: string) {
    setValue((current) => ({ ...current, availability: current.availability.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: field === "weekday" ? Number(next) : next } : item) }));
  }

  return <form onSubmit={(event) => { event.preventDefault(); void onSave({ roles: value.roles, availability: value.availability }); }} className="space-y-5">
      <fieldset><legend className="text-xs font-semibold">Qualified roles</legend><div className="mt-3 grid grid-cols-2 gap-2">{Object.keys(ROLE_COLORS).map((role) => <label key={role} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#e2e5d8] bg-white px-3 py-2.5 text-sm"><input type="checkbox" checked={value.roles.includes(role)} onChange={() => toggleRole(role)} />{role}</label>)}</div></fieldset>
      <fieldset><div className="flex items-center justify-between"><legend className="text-xs font-semibold">Recurring availability</legend><button type="button" onClick={() => setValue((current) => ({ ...current, availability: [...current.availability, { weekday: 1, start: "09:00", end: "17:00" }] }))} className="text-xs font-semibold text-[#55715e] hover:underline">Add hours</button></div><div className="mt-3 space-y-2">{value.availability.map((item, index) => <div key={index} className="grid grid-cols-[minmax(0,1fr)_72px_72px_auto] items-end gap-2 rounded-xl border border-[#e2e5d8] bg-white p-2"><label className="text-[10px] font-medium text-[#68725f]">Day<select value={item.weekday} onChange={(event) => updateAvailability(index, "weekday", event.target.value)} className="mt-1 block w-full bg-transparent text-xs outline-none">{weekdays.map((day, dayIndex) => <option key={day} value={dayIndex + 1}>{day}</option>)}</select></label><label className="text-[10px] font-medium text-[#68725f]">From<input type="time" value={item.start} onChange={(event) => updateAvailability(index, "start", event.target.value)} className="mt-1 block w-full bg-transparent text-xs outline-none" /></label><label className="text-[10px] font-medium text-[#68725f]">Until<input type="time" value={item.end} onChange={(event) => updateAvailability(index, "end", event.target.value)} className="mt-1 block w-full bg-transparent text-xs outline-none" /></label><button type="button" onClick={() => setValue((current) => ({ ...current, availability: current.availability.filter((_, itemIndex) => itemIndex !== index) }))} className="pb-1 text-xs font-medium text-[#a64e38] hover:underline">Remove</button></div>)}{!value.availability.length && <p className="rounded-xl border border-dashed border-[#d6d9cf] p-3 text-xs text-[#7c886f]">No recurring availability added.</p>}</div></fieldset>
      <button disabled={saving} className={`${primaryButton} w-full`}>{saving ? "Saving profile..." : "Save scheduling profile"}</button>
    </form>;
}

export function DraftRosterDialog({ weekStart, dates, members, draft, generating, applying, onClose, onGenerate, onApply }: {
  weekStart: string;
  dates: Date[];
  members: TeamMember[];
  draft?: RosterDraft;
  generating: boolean;
  applying: boolean;
  onClose: () => void;
  onGenerate: (openShifts: OpenShift[]) => Promise<string | undefined>;
  onApply: () => Promise<string | undefined>;
}) {
  const [openShifts, setOpenShifts] = useState<OpenShift[]>([{ date: weekStart, start: "09:00", end: "17:00", role: "Server" }]);
  const [error, setError] = useState<string>();
  const names = new Map(members.map((member) => [member.id, member.name]));

  function update(index: number, field: keyof OpenShift, value: string) { setOpenShifts((current) => current.map((shift, shiftIndex) => shiftIndex === index ? { ...shift, [field]: value } : shift)); }
  async function generate() {
    if (openShifts.some((shift) => shift.start >= shift.end)) { setError("Each shift must end after it starts. Overnight shifts are not supported."); return; }
    setError(await onGenerate(openShifts));
  }

  return <Dialog title={draft ? "Review your draft" : "Build a roster draft"} onClose={onClose}>
    {!draft ? <><p className="-mt-3 mb-5 text-sm leading-6 text-[#7c886f]">Add the coverage you need for this week. We will match it against saved team roles and availability.</p><div className="space-y-3">{openShifts.map((shift, index) => <div key={index} className="rounded-xl border border-[#e2e5d8] bg-white p-3"><div className="grid grid-cols-2 gap-3"><label className="text-xs font-semibold">Date<select value={shift.date} onChange={(event) => update(index, "date", event.target.value)} className={fieldClass}>{dates.map((date) => { const value = date.toISOString().slice(0, 10); return <option key={value} value={value}>{date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })}</option>; })}</select></label><label className="text-xs font-semibold">Role<select value={shift.role} onChange={(event) => update(index, "role", event.target.value)} className={fieldClass}>{Object.keys(ROLE_COLORS).map((role) => <option key={role}>{role}</option>)}</select></label><label className="text-xs font-semibold">Starts<input type="time" value={shift.start} onChange={(event) => update(index, "start", event.target.value)} className={fieldClass} /></label><label className="text-xs font-semibold">Ends<input type="time" value={shift.end} onChange={(event) => update(index, "end", event.target.value)} className={fieldClass} /></label></div>{openShifts.length > 1 && <button type="button" onClick={() => setOpenShifts((current) => current.filter((_, shiftIndex) => shiftIndex !== index))} className="mt-3 text-xs font-medium text-[#a64e38] hover:underline">Remove shift</button>}</div>)}</div><button type="button" onClick={() => setOpenShifts((current) => [...current, { date: weekStart, start: "09:00", end: "17:00", role: "Server" }])} className="mt-4 text-xs font-semibold text-[#55715e] hover:underline">Add another open shift</button>{error && <p role="alert" className="mt-4 rounded-xl bg-[#fde2cf] p-3 text-sm text-[#854b23]">{error}</p>}<p className="mt-5 text-xs leading-5 text-[#707a70]">Generating a draft does not save or publish anything.</p><button type="button" disabled={generating || !members.length} onClick={() => void generate()} className={`${primaryButton} mt-5 w-full`}>{generating ? "Generating draft..." : "Generate draft"}</button></> : <><div className="rounded-2xl bg-[#edf1e2] p-4"><p className="text-sm font-semibold">{draft.generated_shifts.length} generated shifts · {draft.unfilled_shifts.length} unfilled</p><p className="mt-2 text-xs leading-5 text-[#65735a]">This preview is not saved. Applying it overwrites this week&apos;s roster with {draft.manual_shifts.length} existing manual and {draft.generated_shifts.length} generated shifts.</p></div>{error && <p role="alert" className="mt-4 rounded-xl bg-[#fde2cf] p-3 text-sm text-[#854b23]">{error}</p>}<div className="mt-5 space-y-4"><div><h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#68725f]">Generated shifts</h3><div className="mt-2 space-y-2">{draft.generated_shifts.map((shift, index) => <p key={`${shift.team_member_id}-${shift.date}-${index}`} className="rounded-xl border border-[#e2e5d8] bg-white px-3 py-2 text-sm"><span className="font-semibold">{names.get(shift.team_member_id) ?? "Team member"}</span><span className="text-[#74806d]"> · {shift.date} · {shift.start}-{shift.end} · {shift.role}</span></p>)}{!draft.generated_shifts.length && <p className="text-sm text-[#74806d]">No shifts could be generated.</p>}</div></div><div><h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#68725f]">Unfilled demand</h3><div className="mt-2 space-y-2">{draft.unfilled_shifts.map((shift, index) => <p key={`${shift.date}-${shift.start}-${index}`} className="rounded-xl border border-[#f1c9b0] bg-[#fff7f1] px-3 py-2 text-sm text-[#854b23]">{shift.date} · {shift.start}-{shift.end} · {shift.role}</p>)}{!draft.unfilled_shifts.length && <p className="text-sm text-[#658247]">All requested shifts are covered.</p>}</div></div></div><button type="button" disabled={applying} onClick={() => void onApply().then(setError)} className={`${primaryButton} mt-6 w-full`}>{applying ? "Applying draft..." : "Apply draft and save roster"}</button><button type="button" disabled={applying} onClick={onClose} className="mt-3 w-full text-xs font-semibold text-[#707a70] hover:text-[#17211e]">Keep reviewing</button></>}
  </Dialog>;
}
