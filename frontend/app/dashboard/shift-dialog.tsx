"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ROLE_COLORS, type Employee, type Shift } from "./data";
import { Icon } from "./icons";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type ShiftSelection = {
  employeeId?: string;
  shiftIndex?: number;
  day?: number;
  shift?: Shift;
};

export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog ref={ref} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-[#dedfd4] bg-[#fafaf6] p-0 font-sans text-[#17211e] shadow-2xl backdrop:bg-[#17211e]/45 backdrop:backdrop-blur-sm" aria-labelledby="dashboard-dialog-title">
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="dashboard-dialog-title" className="text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="grid size-9 shrink-0 place-items-center rounded-full border border-[#dedfd4] hover:bg-white"><Icon name="close" /></button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

const fieldClass = "mt-2 block w-full rounded-xl border border-[#d6d9cf] bg-white px-3 py-3 text-sm outline-none focus:border-[#55715e] focus:ring-2 focus:ring-[#d9ff57]";

export function ShiftDialog({ selection, employees, dates, onClose, onSave, onDelete }: {
  selection: ShiftSelection;
  employees: Employee[];
  dates: Date[];
  onClose: () => void;
  onSave: (employeeId: string, shift: Shift) => string | undefined | Promise<string | undefined>;
  onDelete: () => void | Promise<void>;
}) {
  const [error, setError] = useState<string>();
  const editing = selection.shiftIndex !== undefined;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await onSave(String(form.get("employee")), {
      day: Number(form.get("day")),
      role: String(form.get("role")),
      start: String(form.get("start")),
      end: String(form.get("end")),
    });
    setError(result);
  }

  return (
      <Dialog title={editing ? "Make a little adjustment." : "A new shift, sorted."} onClose={onClose}>
      <p className="-mt-3 mb-6 text-sm leading-6 text-[#707a70]">Set the details. We’ll check for overlapping shifts before saving the roster.</p>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-xs font-semibold">Team member
          <select name="employee" required defaultValue={selection.employeeId ?? ""} className={fieldClass}>
            <option value="" disabled>Choose a teammate</option>
            {employees.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-xs font-semibold">Day
            <select name="day" defaultValue={selection.shift?.day ?? selection.day ?? 0} className={fieldClass}>
              {dates.map((date, index) => <option key={index} value={index}>{DAYS[index]}, {date.getUTCDate()} {date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold">Role
            <select name="role" defaultValue={selection.shift?.role ?? employees.find((person) => person.id === selection.employeeId)?.shifts[0]?.role ?? "Server"} className={fieldClass}>
              {Object.keys(ROLE_COLORS).map((role) => <option key={role}>{role}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-xs font-semibold">Starts at
            <input type="time" name="start" required defaultValue={selection.shift?.start.padStart(5, "0") ?? "09:00"} className={fieldClass} />
          </label>
          <label className="block text-xs font-semibold">Ends at
            <input type="time" name="end" required defaultValue={selection.shift?.end.padStart(5, "0") ?? "17:00"} className={fieldClass} />
          </label>
        </div>
        {error && <p role="alert" className="rounded-xl bg-[#fde2cf] p-3 text-sm text-[#854b23]">{error}</p>}
        <p className="pt-2 text-xs leading-5 text-[#707a70]">Changes are saved to your workspace.</p>
        <div className="flex items-center justify-between gap-3 border-t border-[#e3e4db] pt-5">
          {editing ? <button type="button" onClick={onDelete} className="text-sm font-medium text-[#a64e38] hover:underline">Delete shift</button> : <button type="button" onClick={onClose} className="text-sm font-medium text-[#707a70] hover:text-[#17211e]">Cancel</button>}
          <button type="submit" className="flex items-center gap-2 rounded-full bg-[#17211e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#32483d]">Save shift<Icon name="check" className="size-4" /></button>
        </div>
      </form>
    </Dialog>
  );
}
