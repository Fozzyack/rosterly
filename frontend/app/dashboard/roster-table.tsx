import { ROLE_COLORS, formatHours, shiftHours, type Employee, type OpenShift } from "./data";
import { DAYS, type ShiftSelection } from "./shift-dialog";
import { Icon } from "./icons";

export function RosterTable({ employees, openShifts, dates, demoWeek, onSelect }: {
  employees: Employee[];
  openShifts: OpenShift[];
  dates: Date[];
  demoWeek: boolean;
  onSelect: (selection: ShiftSelection) => void;
}) {
  return (
    <div className="overflow-x-auto overscroll-x-contain" tabIndex={0} role="region" aria-label="Weekly roster, scroll horizontally to see all days">
      <table className="w-full min-w-[930px] table-fixed border-collapse text-left">
        <caption className="sr-only">Employee shifts for the week beginning {dates[0].toLocaleDateString("en-GB", { timeZone: "UTC" })}. Select a shift to edit it, or an empty day to add one.</caption>
        <thead>
          <tr className="border-y border-[#e5e6de] bg-[#fafbf7]">
            <th scope="col" className="w-[175px] px-5 py-4 text-[11px] font-medium text-[#7b847b]">Team member <span className="ml-1 rounded-md bg-[#ecede5] px-1.5 py-0.5 text-[10px]">{employees.length}</span></th>
            {dates.map((date, day) => (
              <th scope="col" key={day} className={`border-l border-[#e5e6de] px-2 py-3 text-center ${demoWeek && day === 2 ? "bg-[#f2f6e8]" : ""}`}>
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#7b847b]">{DAYS[day]}</span>
                <span className={`mx-auto mt-1 grid size-7 place-items-center rounded-full text-sm font-semibold ${demoWeek && day === 2 ? "bg-[#d9ff57]" : ""}`}>{date.getUTCDate()}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[#e5e6de] bg-[#fffdf7]">
            <th scope="row" className="px-5 py-4">
              <div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-full border border-dashed border-[#c3b999] text-[#9b8150]"><Icon name="plus" className="size-4" /></span><div><p className="text-xs font-semibold">Open shifts</p><p className="mt-1 text-[10px] font-normal text-[#95805c]">{openShifts.length ? `${openShifts.length} need a teammate` : "All shifts covered"}</p></div></div>
            </th>
            {DAYS.map((day, dayIndex) => (
              <td key={day} className="border-l border-[#e5e6de] p-1.5 align-middle">
                {openShifts.map((shift, index) => shift.day === dayIndex && (
                  <button key={index} type="button" onClick={() => onSelect({ openIndex: index, shift })} className="my-1 w-full rounded-lg border border-dashed border-[#d5bd83] bg-[#faf2dc]/50 px-2.5 py-2 text-left transition-colors hover:bg-[#f7eccf]" aria-label={`Assign open ${shift.role} shift on ${day}, ${shift.start} to ${shift.end}`}>
                    <span className="block whitespace-nowrap text-[10px] font-semibold text-[#79623a]">{shift.start} – {shift.end}</span>
                    <span className="mt-1 flex items-center justify-between text-[10px] text-[#8d794f]">{shift.role}<Icon name="plus" className="size-3" /></span>
                  </button>
                ))}
                {!openShifts.some((shift) => shift.day === dayIndex) && <span className="block text-center text-xs text-[#d4d6ca]">—</span>}
              </td>
            ))}
          </tr>
          {employees.map((person) => (
            <tr key={person.id} className="border-b border-[#e8e9e1] last:border-b-0">
              <th scope="row" className="px-5 py-4">
                <div className="flex items-center gap-2.5"><span className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${person.color}`}>{person.initials}</span><div className="min-w-0"><p className="truncate text-xs font-semibold">{person.name}</p><p className="mt-1 text-[10px] font-normal text-[#7b847b]">{formatHours(person.shifts.reduce((total, shift) => total + shiftHours(shift), 0))} this week</p></div></div>
              </th>
              {DAYS.map((day, dayIndex) => {
                const off = person.timeOff?.includes(dayIndex);
                const hasShift = person.shifts.some((shift) => shift.day === dayIndex);
                return (
                  <td key={day} className={`border-l border-[#e8e9e1] p-1.5 align-middle ${demoWeek && dayIndex === 2 ? "bg-[#f8faef]/60" : dayIndex > 4 ? "bg-[#fafbf7]/70" : ""}`}>
                    {person.shifts.map((shift, index) => shift.day === dayIndex && (
                      <button key={index} type="button" onClick={() => onSelect({ employeeId: person.id, shiftIndex: index, shift })} className={`my-1 w-full rounded-lg border border-l-[3px] px-2 py-2 text-left transition-transform hover:-translate-y-0.5 hover:shadow-sm ${ROLE_COLORS[shift.role].chip}`} aria-label={`Edit ${person.name}'s ${day} shift, ${shift.start} to ${shift.end}, ${shift.role}`}>
                        <span className="block whitespace-nowrap text-[10px] font-semibold">{shift.start} – {shift.end}</span>
                        <span className="mt-1 block text-[10px] text-[#52605b]">{shift.role}</span>
                      </button>
                    ))}
                    {!hasShift && (off ? <span className="flex h-[52px] items-center justify-center gap-1.5 rounded-lg bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,#e8e9e140_4px,#e8e9e140_5px)] text-[10px] text-[#8b9188]"><Icon name="leaf" className="size-3" />Time off</span> : <button type="button" className="group grid min-h-[52px] w-full place-items-center rounded-lg text-[#d1d6c9] transition-colors hover:bg-[#f1f4e9] hover:text-[#55715e]" onClick={() => onSelect({ employeeId: person.id, day: dayIndex })} aria-label={`Add shift for ${person.name} on ${day}`}><Icon name="plus" className="size-3.5 opacity-40 group-hover:opacity-100" /></button>)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && <p className="p-8 text-sm text-[#707a70]">No teammates match your search. Try another name or role.</p>}
    </div>
  );
}
