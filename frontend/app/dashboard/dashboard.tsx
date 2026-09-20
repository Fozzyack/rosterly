"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "../components/site-header";
import { EMPLOYEES, LEAVE_REQUESTS, OPEN_SHIFTS, ROLE_COLORS, formatHours, shiftHours, type Employee, type LeaveRequest, type OpenShift, type Role, type Shift } from "./data";
import { Icon, type IconName } from "./icons";
import { RosterTable } from "./roster-table";
import { DAYS, Dialog, ShiftDialog, type ShiftSelection } from "./shift-dialog";
import styles from "./dashboard.module.css";

type Week = { employees: Employee[]; openShifts: OpenShift[]; published: boolean };
type RequestStatus = "Approved" | "Declined" | "Reviewed";

function emptyWeek(): Week {
  return { employees: EMPLOYEES.map((person) => ({ ...person, shifts: [], timeOff: [] })), openShifts: [], published: false };
}

function weekDates(offset: number) {
  return DAYS.map((_, day) => new Date(Date.UTC(2026, 8, 14 + offset * 7 + day)));
}

function dateLabel(date: Date, options: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString("en-GB", { ...options, timeZone: "UTC" });
}

const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-full border border-[#d9dcd0] bg-white/80 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#f0f3e8]";
const primaryButton = "inline-flex items-center justify-center gap-2 rounded-full bg-[#17211e] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#334b3d] disabled:cursor-default disabled:opacity-50";

export function Dashboard() {
  const router = useRouter();
  const [weeks, setWeeks] = useState<Record<number, Week>>({ 0: { employees: EMPLOYEES, openShifts: OPEN_SHIFTS, published: false } });
  const [weekOffset, setWeekOffset] = useState(0);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "All roles">("All roles");
  const [selection, setSelection] = useState<ShiftSelection | null>(null);
  const [dialog, setDialog] = useState<"team" | "publish" | null>(null);
  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [requestStatuses, setRequestStatuses] = useState<Record<string, RequestStatus>>({});
  const [requestError, setRequestError] = useState<string>();
  const [notice, setNotice] = useState("");
  const [activeNav, setActiveNav] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);

  const week = weeks[weekOffset] ?? emptyWeek();
  const dates = weekDates(weekOffset);
  const shifts = week.employees.flatMap((person) => person.shifts);
  const hours = shifts.reduce((sum, shift) => sum + shiftHours(shift), 0);
  const totalShifts = shifts.length + week.openShifts.length;
  const coverage = totalShifts ? Math.round(shifts.length / totalShifts * 100) : 0;
  const scheduledTeam = week.employees.filter((person) => person.shifts.length > 0);
  const pendingRequests = LEAVE_REQUESTS.filter((item) => !requestStatuses[item.id]);
  const filteredEmployees = week.employees.filter((person) => person.name.toLowerCase().includes(query.toLowerCase()) && (role === "All roles" || person.shifts.some((shift) => shift.role === role)));
  const dailyHours = DAYS.map((_, day) => shifts.filter((shift) => shift.day === day).reduce((sum, shift) => sum + shiftHours(shift), 0));
  const maxDailyHours = Math.max(...dailyHours, 1);
  const dateRange = `${dateLabel(dates[0], { day: "numeric", month: "short" })} – ${dateLabel(dates[6], { day: "numeric", month: "short", year: "numeric" })}`;

  function notify(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 6000);
  }

  function updateWeek(next: Week) {
    setWeeks((current) => ({ ...current, [weekOffset]: { ...next, published: false } }));
  }

  function navigate(id: string) {
    setActiveNav(id);
    setMobileNav(false);
  }

  async function logOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function saveShift(employeeId: string, shift: Shift): string | undefined {
    if (!selection) return;
    if (shiftHours(shift) <= 0) return "Choose an end time after the start time. Overnight shifts aren’t supported in this demo.";
    const person = week.employees.find((item) => item.id === employeeId);
    if (!person) return "Choose a team member.";
    if (person.timeOff?.includes(shift.day)) return `${person.name} has time off on ${DAYS[shift.day]}. Choose another day or teammate.`;
    const minutes = (time: string) => { const [hours, minutes] = time.split(":").map(Number); return hours * 60 + minutes; };
    const overlaps = person.shifts.some((existing, index) => !(selection.employeeId === employeeId && selection.shiftIndex === index) && existing.day === shift.day && minutes(shift.start) < minutes(existing.end) && minutes(shift.end) > minutes(existing.start));
    if (overlaps) return `${person.name} already has a shift during those hours. Adjust the time or choose another teammate.`;

    const employees = week.employees.map((item) => {
      const remaining = item.id === selection.employeeId ? item.shifts.filter((_, index) => index !== selection.shiftIndex) : item.shifts;
      return { ...item, shifts: item.id === employeeId ? [...remaining, shift] : remaining };
    });
    updateWeek({ ...week, employees, openShifts: week.openShifts.filter((_, index) => index !== selection.openIndex) });
    setSelection(null);
    notify(selection.openIndex !== undefined ? `Shift covered. ${person.name} is on the roster.` : `Shift saved for ${person.name}.`);
  }

  function deleteShift() {
    if (!selection) return;
    updateWeek({ ...week, employees: week.employees.map((person) => person.id === selection.employeeId ? { ...person, shifts: person.shifts.filter((_, index) => index !== selection.shiftIndex) } : person) });
    setSelection(null);
    notify("Shift removed. Your weekly totals are up to date.");
  }

  function reviewRequest(status: RequestStatus) {
    if (!request) return;
    if (status === "Approved" && request.days) {
      const requestedWeek = weeks[request.weekOffset] ?? emptyWeek();
      const person = requestedWeek.employees.find((item) => item.id === request.employeeId);
      if (person?.shifts.some((shift) => request.days?.includes(shift.day))) {
        setRequestError("This teammate has shifts on the requested days. Reassign those shifts before approving time off.");
        return;
      }
      setWeeks((current) => ({ ...current, [request.weekOffset]: { ...requestedWeek, published: false, employees: requestedWeek.employees.map((item) => item.id === request.employeeId ? { ...item, timeOff: [...new Set([...(item.timeOff ?? []), ...request.days!])] } : item) } }));
    }
    setRequestStatuses((current) => ({ ...current, [request.id]: status }));
    setRequest(null);
    notify(`${request.employee}’s request ${status.toLowerCase()} in this demo.`);
  }

  function exportRoster() {
    const rows = [["Employee", "Date", "Role", "Start", "End", "Hours"], ...week.employees.flatMap((person) => person.shifts.map((shift) => [person.name, dates[shift.day].toISOString().slice(0, 10), shift.role, shift.start, shift.end, String(shiftHours(shift))])), ...week.openShifts.map((shift) => ["Unassigned", dates[shift.day].toISOString().slice(0, 10), shift.role, shift.start, shift.end, String(shiftHours(shift))])];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `rosterly-${dates[0].toISOString().slice(0, 10)}.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Your weekly roster has been exported.");
  }

  const navigation: { id: string; label: string; icon: IconName; count?: number }[] = [
    { id: "overview", label: "Overview", icon: "overview" },
    { id: "roster", label: "Weekly roster", icon: "calendar" },
    { id: "team", label: "My team", icon: "team" },
    { id: "requests", label: "Requests", icon: "inbox", count: pendingRequests.length },
    { id: "insights", label: "Insights", icon: "chart" },
  ];

  return (
    <div className={`${styles.shell} min-h-screen bg-[#f5f3ea] font-sans text-[#17211e] selection:bg-[#d9ff57] selection:text-[#17211e]`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#d9ff57] focus:px-5 focus:py-3">Skip to dashboard</a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[222px] flex-col bg-[#1c2a23] text-[#eef1e9] lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-7 py-8" aria-label="Rosterly home"><LogoMark /><span className="text-[25px] font-semibold tracking-[-0.06em]">rosterly<span className="text-[#d9ff57]">.</span></span></Link>
        <div className="mx-4 mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#dfe6d5] text-[#334b3d]"><Icon name="leaf" /></span>
          <div><p className="text-xs font-medium">North Street Café</p><p className="mt-1 text-[10px] text-[#a0ad9f]">A little team, a lot of heart</p></div>
        </div>
        <p className="px-7 pb-3 pt-9 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a9a8a]">Your workspace</p>
        <nav className="space-y-1 px-4" aria-label="Dashboard navigation">
          {navigation.map((item) => item.id === "team" ? (
            <button key={item.id} type="button" onClick={() => setDialog("team")} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-[#b4c1b4] transition-colors hover:bg-white/5 hover:text-white"><Icon name={item.icon} />{item.label}</button>
          ) : (
            <a key={item.id} href={`#${item.id}`} onClick={() => navigate(item.id)} aria-current={activeNav === item.id ? "location" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-colors ${activeNav === item.id ? "bg-[#d9ff57] text-[#23301f]" : "text-[#b4c1b4] hover:bg-white/5 hover:text-white"}`}><Icon name={item.icon} />{item.label}{Boolean(item.count) && <span className="ml-auto grid size-5 place-items-center rounded-md bg-[#d9ff57] text-[10px] font-semibold text-[#23301f]">{item.count}</span>}</a>
          ))}
        </nav>
        <div className="mx-5 mb-6 mt-auto pt-10">
          <div className="relative overflow-hidden rounded-2xl border border-[#53604a] bg-[#2b3b2b] p-4">
            <div className="relative mb-5 flex h-12 items-center"><Icon name="sparkles" className="size-9 text-[#d9ff57]" /><span className="absolute left-9 top-0 h-14 w-20 -rotate-[25deg] rounded-[50%] border border-[#82995d]/35" /><span className="absolute left-12 top-2 h-9 w-16 rotate-[25deg] rounded-[50%] border border-[#82995d]/35" /></div>
            <p className="text-sm font-medium leading-5">Less admin.<br /><span className="text-[#d9ff57]">More good days.</span></p>
            <p className="mt-2 text-[11px] leading-5 text-[#adbaa6]">A little help making your next week a great one.</p>
            <Link href="/how-it-works" className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-medium hover:text-[#d9ff57]">Meet your scheduling sidekick<Icon name="arrow" className="size-3.5" /></Link>
          </div>
          <Link href="/how-it-works" className="mt-6 flex items-center gap-2.5 px-2 text-xs text-[#b4c1b4] hover:text-white"><Icon name="help" className="size-4" />A little help?</Link>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 px-6 py-5"><span className="grid size-9 place-items-center rounded-full bg-[#dfe6d5] text-xs font-semibold text-[#23301f]">AS</span><div><p className="text-xs font-medium">Alex Smith</p><p className="mt-1 text-[10px] text-[#96a591]">Workspace manager</p></div><button type="button" onClick={logOut} className="ml-auto text-[10px] font-semibold text-[#b4c1b4] transition-colors hover:text-white">Log out</button></div>
      </aside>

      <div className="lg:pl-[222px]">
        <header className="flex min-h-[76px] items-center justify-between gap-3 border-b border-[#dfdfd4] px-5 sm:px-8 xl:px-10">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Toggle dashboard navigation" aria-expanded={mobileNav} aria-controls="mobile-dashboard-nav" onClick={() => setMobileNav(!mobileNav)} className="grid size-9 place-items-center rounded-full border border-[#d9dcd0] lg:hidden"><Icon name={mobileNav ? "close" : "menu"} /></button>
            <div className="hidden items-center gap-2 text-xs text-[#7e867a] sm:flex"><span>Workspace</span><Icon name="chevron" className="size-3 text-[#a6ac9e]" /><span className="font-medium text-[#273729]">Overview</span></div>
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-0.04em] sm:hidden"><LogoMark small />rosterly</Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="flex items-center gap-1.5 rounded-full border border-[#d9dcd0] px-2.5 py-1 text-[10px] font-medium text-[#68725f]"><span className="size-1.5 rounded-full bg-[#8ba56d]" />Demo workspace</span>
            <a href="#requests" onClick={() => navigate("requests")} className="relative grid size-9 place-items-center rounded-full transition-colors hover:bg-white" aria-label={`${pendingRequests.length} pending requests`}><Icon name="bell" />{pendingRequests.length > 0 && <span className="absolute right-2 top-1.5 size-1.5 rounded-full bg-[#bb773e] ring-2 ring-[#f5f3ea]" />}</a>
            <span className="hidden h-6 w-px bg-[#d9dcd0] sm:block" /><span className="hidden size-8 place-items-center rounded-full border-2 border-white bg-[#e0e7d6] text-[10px] font-semibold sm:grid">AS</span>
          </div>
        </header>
        {mobileNav && <nav id="mobile-dashboard-nav" className="flex flex-wrap gap-2 border-b border-[#dfdfd4] bg-[#eeeee3] p-4 lg:hidden" aria-label="Mobile dashboard navigation">{navigation.map((item) => item.id === "team" ? <button key={item.id} type="button" className={secondaryButton} onClick={() => { setDialog("team"); setMobileNav(false); }}><Icon name={item.icon} className="size-4" />{item.label}</button> : <a key={item.id} href={`#${item.id}`} className={secondaryButton} onClick={() => navigate(item.id)}><Icon name={item.icon} className="size-4" />{item.label}</a>)}</nav>}

        <main id="main-content" className="mx-auto max-w-[1600px] px-5 pb-6 pt-8 sm:px-8 sm:pt-9 xl:px-10">
          <section id="overview" className={`${styles.enter} scroll-mt-6`}>
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#7d8775]"><Icon name="sun" className="size-4 text-[#a18e4e]" />A fresh perspective on your week</p>
                <h1 className="text-[clamp(1.9rem,3.1vw,2.8rem)] font-semibold leading-tight tracking-[-0.06em]">Good morning, Alex<span className="text-[#8ca368]">.</span></h1>
                <p className="mt-2 text-[13px] leading-6 text-[#74806d]">A happy team starts with a well-planned week. Let&apos;s make it one.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button type="button" onClick={exportRoster} className={secondaryButton}><Icon name="export" className="size-4" />Export</button>
                <button type="button" onClick={() => setDialog("publish")} disabled={week.published || shifts.length === 0} className="inline-flex items-center gap-2 rounded-full bg-[#d9ff57] px-5 py-3 text-xs font-semibold shadow-[0_3px_0_#b5ce6c] transition-colors hover:bg-[#cdef4d] disabled:cursor-default disabled:opacity-60"><Icon name={week.published ? "check" : "sparkles"} className="size-4" />{week.published ? "Roster published" : "Publish roster"}</button>
              </div>
            </div>

            <div className={`${styles.stats} mt-7 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4`}>
              <div className="rounded-2xl border border-[#dfe2d4] bg-[#eef1e4] p-5">
                <div className="flex items-center justify-between text-xs font-medium text-[#65735a]"><span>Scheduled hours</span><Icon name="clock" className="size-4" /></div>
                <div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-[34px] font-semibold leading-none tracking-[-0.06em]">{formatHours(hours).replace("h", "")}<span className="ml-1 text-lg font-normal text-[#7d8d6b]">h</span></p><p className="mt-3 text-[10px] text-[#7c886f]">Across {shifts.length} shifts this week</p></div><div className="flex h-11 items-end gap-1.5" aria-hidden="true">{dailyHours.map((value, i) => <span key={i} className={`w-2 rounded-t-sm ${i === 2 ? "bg-[#69864e]" : "bg-[#ccd6b9]"}`} style={{ height: `${Math.max(8, value / maxDailyHours * 100)}%` }} />)}</div></div>
              </div>
              <div className="rounded-2xl border border-[#e1e2d8] bg-white/80 p-5">
                <div className="flex items-center justify-between text-xs font-medium text-[#73806b]"><span>Team scheduled</span><Icon name="team" className="size-4" /></div>
                <div className="mt-4 flex items-end justify-between"><div><p className="text-[34px] font-semibold leading-none tracking-[-0.06em]">{scheduledTeam.length}<span className="ml-1.5 text-base font-normal text-[#9ba38f]">/ {week.employees.length}</span></p><p className="mt-3 text-[10px] text-[#7c886f]">Good people, working together</p></div><button type="button" aria-label="View team members" onClick={() => setDialog("team")} className="mb-1 flex -space-x-2">{EMPLOYEES.slice(0, 3).map((person) => <span key={person.id} className={`grid size-7 place-items-center rounded-full border-2 border-white text-[8px] font-semibold ${person.color}`}>{person.initials}</span>)}</button></div>
              </div>
              <a href="#roster" onClick={() => navigate("roster")} className="rounded-2xl border border-[#e1e2d8] bg-white/80 p-5 transition-colors hover:bg-[#fffdf5]">
                <div className="flex items-center justify-between text-xs font-medium text-[#73806b]"><span>Open shifts</span><Icon name="calendar" className="size-4" /></div>
                <div className="mt-4 flex items-end justify-between"><div><p className="text-[34px] font-semibold leading-none tracking-[-0.06em]">{week.openShifts.length.toString().padStart(2, "0")}</p><p className="mt-3 flex items-center gap-1.5 text-[10px] text-[#997442]"><span className={`size-1.5 rounded-full ${week.openShifts.length ? "bg-[#c29553]" : "bg-[#8ba56d]"}`} />{week.openShifts.length ? "A few spots to fill" : "All shifts have a teammate"}</p></div><span className="mb-1 grid size-8 place-items-center rounded-full bg-[#f7f2e5] text-[#9d8354]"><Icon name="arrow" className="size-4 -rotate-45" /></span></div>
              </a>
              <div className="rounded-2xl border border-[#e1e2d8] bg-white/80 p-5">
                <div className="flex items-center justify-between text-xs font-medium text-[#73806b]"><span>Roster coverage</span><Icon name="check" className="size-4" /></div>
                <div className="mt-4 flex items-baseline justify-between"><p className="text-[34px] font-semibold leading-none tracking-[-0.06em]">{coverage}<span className="ml-0.5 text-lg font-normal text-[#9ba38f]">%</span></p><span className="text-[10px] text-[#80906d]">{totalShifts ? `${shifts.length} of ${totalShifts} shifts` : "A fresh canvas"}</span></div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#eef0e6]" role="progressbar" aria-label="Roster coverage" aria-valuenow={coverage} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-[#9ab674] transition-[width]" style={{ width: `${coverage}%` }} /></div>
              </div>
            </div>
          </section>

          <section id="roster" className={`${styles.roster} mt-7 scroll-mt-6 overflow-hidden rounded-[20px] border border-[#dfe1d4] bg-[#fdfefa] shadow-[0_3px_12px_rgba(39,48,30,0.025)]`} aria-labelledby="roster-heading">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 pb-5 pt-6 sm:px-6">
              <div className="flex items-center gap-3"><div><h2 id="roster-heading" className="text-lg font-semibold tracking-[-0.04em]">Your weekly roster</h2><p className="mt-1 text-[11px] text-[#849078]">A place for everyone. A plan for every day.</p></div><span className={`mb-5 rounded-md px-2 py-1 text-[9px] font-medium ${week.published ? "bg-[#e4efda] text-[#5f7847]" : "bg-[#f1eee2] text-[#938567]"}`}>{week.published ? "Published" : "Draft"}</span></div>
              <button type="button" onClick={() => setSelection({})} className={primaryButton}><Icon name="plus" className="size-4" />Add shift</button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-5 sm:px-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-[#e0e3d7] bg-white p-0.5"><button type="button" onClick={() => setWeekOffset(weekOffset - 1)} aria-label="Previous week" className="grid size-8 place-items-center rounded-md text-[#7d8a6f] hover:bg-[#f0f3e8]"><Icon name="chevron" className="size-3.5 rotate-180" /></button><p className="min-w-[156px] px-1 text-center text-[11px] font-medium" aria-live="polite">{dateRange}</p><button type="button" onClick={() => setWeekOffset(weekOffset + 1)} aria-label="Next week" className="grid size-8 place-items-center rounded-md text-[#7d8a6f] hover:bg-[#f0f3e8]"><Icon name="chevron" className="size-3.5" /></button></div>
                <button type="button" onClick={() => setWeekOffset(0)} className="rounded-lg border border-[#e0e3d7] px-3 py-2.5 text-[10px] font-medium text-[#738267] hover:bg-[#f0f3e8]">Demo week</button>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#e0e3d7] bg-white px-3 py-2.5 sm:w-[145px]"><Icon name="search" className="size-3.5 text-[#8c987e]" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a teammate" aria-label="Find a teammate" className="w-full min-w-0 bg-transparent text-[10px] outline-none placeholder:text-[#929c86]" /></label>
                <label className="relative"><span className="sr-only">Filter by role</span><select value={role} onChange={(event) => setRole(event.target.value as Role | "All roles")} className="appearance-none rounded-lg border border-[#e0e3d7] bg-white py-2.5 pl-3 pr-8 text-[10px] font-medium text-[#65745a]"><option>All roles</option>{Object.keys(ROLE_COLORS).map((item) => <option key={item}>{item}</option>)}</select><Icon name="down" className="pointer-events-none absolute right-2.5 top-3 size-3" /></label>
              </div>
            </div>
            <RosterTable employees={filteredEmployees} openShifts={week.openShifts} dates={dates} demoWeek={weekOffset === 0} onSelect={setSelection} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e6de] px-5 py-4 sm:px-6"><div className="flex flex-wrap items-center gap-x-4 gap-y-2">{Object.entries(ROLE_COLORS).map(([name, color]) => <span key={name} className="flex items-center gap-1.5 text-[9px] text-[#7b8771]"><span className={`size-1.5 rounded-full ${color.dot}`} />{name}</span>)}</div><span className="flex items-center gap-1.5 text-[9px] text-[#88927e]"><Icon name="clock" className="size-3" />Times in café local time · 24-hour</span></div>
          </section>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            <section id="requests" className="scroll-mt-6 rounded-[20px] border border-[#dfe1d4] bg-[#fdfefa] p-5 sm:p-6" aria-labelledby="requests-heading">
              <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2.5"><h2 id="requests-heading" className="text-base font-semibold tracking-[-0.03em]">A little attention needed</h2><span className="grid size-5 place-items-center rounded-full bg-[#f0eddc] text-[10px] font-semibold text-[#8e805a]">{pendingRequests.length}</span></div><Icon name="inbox" className="size-4 text-[#819172]" /></div>
              <div className="divide-y divide-[#eceee4]">{LEAVE_REQUESTS.map((item) => <div key={item.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"><span className={`grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${item.color}`}>{item.initials}</span><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold">{item.employee}<span className="ml-2 font-normal text-[#89947b]">{item.kind}</span></p><p className="mt-1.5 text-[10px] text-[#8b957f]">{item.date}</p></div>{requestStatuses[item.id] ? <span className={`text-[10px] font-medium ${requestStatuses[item.id] === "Declined" ? "text-[#a26f50]" : "text-[#658247]"}`}>{requestStatuses[item.id]}</span> : <button type="button" onClick={() => { setRequest(item); setRequestError(undefined); }} className="flex items-center gap-1 rounded-full border border-[#e0e4d5] px-3 py-2 text-[10px] font-medium text-[#657657] hover:bg-[#f1f4e8]" aria-label={`Review ${item.employee}'s ${item.kind.toLowerCase()} request`}>Review<Icon name="chevron" className="size-3" /></button>}</div>)}</div>
              {pendingRequests.length === 0 && <p className="mt-4 flex items-center gap-2 text-xs text-[#658247]"><Icon name="check" className="size-4" />All caught up. That&apos;s a good feeling.</p>}
            </section>

            <section id="insights" className="relative scroll-mt-6 overflow-hidden rounded-[20px] border border-[#d9dfc9] bg-[#edf1e2] p-5 sm:p-6" aria-labelledby="insights-heading">
              <div className="flex items-center justify-between"><h2 id="insights-heading" className="text-base font-semibold tracking-[-0.03em]">The shape of your week</h2><span className="text-[10px] text-[#7c8b69]">{formatHours(hours)} scheduled</span></div>
              <div className="mt-5 flex h-[104px] items-end gap-3 sm:gap-5" role="img" aria-label={`Scheduled hours by day: ${DAYS.map((day, index) => `${day} ${dailyHours[index]} hours`).join(", ")}`}>
                {dailyHours.map((value, day) => <div key={day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"><span className="text-[9px] text-[#7e8b6d]">{value}h</span><div className={`w-full max-w-9 rounded-t-[5px] transition-[height] ${day === 2 ? "bg-[#839f5b]" : "bg-[#cbd6b5]"}`} style={{ height: `${Math.max(3, value / maxDailyHours * 67)}px` }} /><span className={`text-[9px] ${day === 2 ? "font-semibold text-[#637b47]" : "text-[#8c977d]"}`}>{DAYS[day]}</span></div>)}
              </div>
              <div className="mt-5 flex items-start gap-2.5 border-t border-[#d7dfc7] pt-4"><Icon name="leaf" className="mt-0.5 size-4 text-[#75924f]" /><div><p className="text-[11px] font-medium text-[#607348]">{week.openShifts.length ? "You’re a few shifts away from a full week." : shifts.length ? "A place for everyone. Looking good." : "A new week, full of possibilities."}</p><p className="mt-1 text-[10px] leading-4 text-[#8b9879]">{week.openShifts.length ? "Select an open shift above to find it a teammate." : shifts.length ? "Every planned shift has someone to make it happen." : "Add your first shift and let the week take shape."}</p></div></div>
            </section>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#e9ecdf] px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-[#dce4c9] text-[#78904e]"><Icon name="sparkles" className="size-4" /></span><p className="text-[11px] text-[#748266]"><span className="font-semibold text-[#526746]">Your week, a little lighter.</span><span className="ml-1.5">Good planning leaves more room for the good stuff.</span></p></div><Link href="/how-it-works" className="flex items-center gap-2 text-[10px] font-semibold text-[#617b47]">Discover smarter scheduling<Icon name="arrow" className="size-3.5" /></Link></div>
          <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 px-1 text-[9px] text-[#949d88]"><p>Made for teams. Built for better days.</p><p>Sample data · Edits reset on refresh<span className="mx-2">/</span>Rosterly © 2026</p></footer>
        </main>
      </div>

      <div role="status" aria-live="polite" aria-atomic="true" className={`fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 ${notice ? "" : "pointer-events-none"}`}>{notice && <div className="flex items-center gap-3 rounded-2xl border border-[#5b7150] bg-[#233628] px-5 py-4 text-sm text-white shadow-xl"><Icon name="check" className="size-5 text-[#d9ff57]" /><p className="flex-1">{notice}</p><button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification" className="p-1"><Icon name="close" className="size-4" /></button></div>}</div>

      {selection && <ShiftDialog selection={selection} employees={week.employees} dates={dates} onClose={() => setSelection(null)} onSave={saveShift} onDelete={deleteShift} />}
      {dialog === "team" && <Dialog title="Good people. Great team." onClose={() => setDialog(null)}><p className="-mt-3 mb-5 text-sm text-[#7c886f]">The people behind North Street Café.</p><div className="space-y-2">{week.employees.map((person) => <div key={person.id} className="flex items-center gap-3 rounded-xl border border-[#e2e5d8] bg-white p-3"><span className={`grid size-10 place-items-center rounded-full text-xs font-semibold ${person.color}`}>{person.initials}</span><div><p className="text-sm font-semibold">{person.name}</p><p className="mt-1 text-xs text-[#7c886f]">{EMPLOYEES.find((item) => item.id === person.id)?.shifts[0]?.role}</p></div><span className="ml-auto text-xs text-[#7c886f]">{formatHours(person.shifts.reduce((sum, shift) => sum + shiftHours(shift), 0))}</span></div>)}</div><p className="mt-5 text-xs text-[#7c886f]">Scheduled hours for {dateRange}. Demo team.</p></Dialog>}
      {dialog === "publish" && <Dialog title="Ready to call it a plan?" onClose={() => setDialog(null)}><div className="mb-5 rounded-2xl bg-[#edf1e2] p-5"><p className="text-sm font-semibold">{dateRange}</p><p className="mt-2 text-xs text-[#7c886f]">{shifts.length} assigned shifts · {formatHours(hours)} · {scheduledTeam.length} teammates</p>{week.openShifts.length > 0 && <p className="mt-3 text-xs text-[#987443]">{week.openShifts.length} open shifts will remain unassigned.</p>}</div><p className="text-sm leading-6 text-[#738069]">This marks the roster as published in your demo workspace. No notifications are sent, and changes reset when you refresh.</p><button type="button" onClick={() => { setWeeks((current) => ({ ...current, [weekOffset]: { ...week, published: true } })); setDialog(null); notify("Your demo roster is published. Your week, sorted."); }} className={`${primaryButton} mt-6 w-full`}><Icon name="check" className="size-4" />Publish demo roster</button></Dialog>}
      {request && <Dialog title={request.kind === "Time off" ? "A little time to recharge." : "A change of plans."} onClose={() => setRequest(null)}><div className="flex items-center gap-3"><span className={`grid size-11 place-items-center rounded-full text-xs font-semibold ${request.color}`}>{request.initials}</span><div><p className="text-sm font-semibold">{request.employee}</p><p className="mt-1 text-xs text-[#7c886f]">{request.kind} · {request.date}</p></div></div><p className="mt-5 text-sm leading-6 text-[#738069]">{request.detail}.</p><p className="mt-3 rounded-xl bg-[#edf1e2] p-4 text-xs leading-6 text-[#6b7c5c]">{request.kind === "Time off" ? "Approving reserves these days as time off in next week’s demo roster." : "A replacement teammate hasn’t been specified. Review the request with Sam before adjusting the Friday roster."}</p>{requestError && <p role="alert" className="mt-3 text-sm text-[#a64e38]">{requestError}</p>}<div className="mt-6 flex justify-between gap-3"><button type="button" className={secondaryButton} onClick={() => reviewRequest("Declined")}>Decline request</button><button type="button" className={primaryButton} onClick={() => reviewRequest(request.kind === "Time off" ? "Approved" : "Reviewed")}><Icon name="check" className="size-4" />{request.kind === "Time off" ? "Approve time off" : "Mark reviewed"}</button></div></Dialog>}
    </div>
  );
}
