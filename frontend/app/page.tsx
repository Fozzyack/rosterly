import { LogoMark, SiteHeader } from "./components/site-header";

const days = [
  { day: "MON", date: "14" },
  { day: "TUE", date: "15" },
  { day: "WED", date: "16" },
  { day: "THU", date: "17" },
  { day: "FRI", date: "18" },
];

const team = [
  { initials: "JM", name: "Jamie", role: "Manager", color: "bg-[#d8efe2]" },
  { initials: "AK", name: "Alex", role: "Front desk", color: "bg-[#f8d9b7]" },
  { initials: "MS", name: "Mia", role: "Sales", color: "bg-[#d8e7fa]" },
  { initials: "TK", name: "Theo", role: "Support", color: "bg-[#eadcf5]" },
];

const shifts = [
  { person: "Jamie", time: "8:00 - 4:00", col: "1", row: "1", tone: "bg-[#d8efe2] border-[#abd5bb]" },
  { person: "Alex", time: "9:00 - 5:00", col: "2", row: "1", tone: "bg-[#f8d9b7] border-[#e8b87e]" },
  { person: "Mia", time: "8:30 - 2:30", col: "3", row: "1", tone: "bg-[#d8e7fa] border-[#adc8ea]" },
  { person: "Theo", time: "10:00 - 6:00", col: "4", row: "1", tone: "bg-[#eadcf5] border-[#ccb5e0]" },
  { person: "Jamie", time: "8:00 - 4:00", col: "5", row: "1", tone: "bg-[#d8efe2] border-[#abd5bb]" },
  { person: "Mia", time: "11:00 - 5:00", col: "1", row: "2", tone: "bg-[#d8e7fa] border-[#adc8ea]" },
  { person: "Theo", time: "12:00 - 6:00", col: "2", row: "2", tone: "bg-[#eadcf5] border-[#ccb5e0]" },
  { person: "Alex", time: "9:00 - 3:00", col: "4", row: "2", tone: "bg-[#f8d9b7] border-[#e8b87e]" },
  { person: "Mia", time: "10:00 - 4:00", col: "5", row: "2", tone: "bg-[#d8e7fa] border-[#adc8ea]" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f3ea] font-sans text-[#17211e] selection:bg-[#d9ff57] selection:text-[#17211e]">
      <SiteHeader />

      <section className="relative mx-auto flex max-w-[1240px] flex-col items-center px-5 pb-10 pt-14 text-center sm:px-8 sm:pt-20 lg:pt-24">
        <h1 className="relative max-w-4xl text-balance text-[clamp(3.25rem,8vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
          Your week,
          <span className="relative inline-block px-3 italic text-[#55715e] sm:px-5">
            sorted.
            <svg className="absolute -bottom-3 left-1/2 w-[92%] -translate-x-1/2 text-[#b8dd3e]" viewBox="0 0 330 15" fill="none" aria-hidden="true">
              <path d="M3 11C73 3 178 2 327 7" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="relative mt-8 max-w-xl text-balance text-base leading-7 text-[#5a6662] sm:text-lg">
          Rosterly builds a fair, fully covered schedule from your team&apos;s availability, skills, and hours in seconds.
        </p>

        <div className="relative mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#17211e] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(23,33,30,0.16)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            href="#signup"
          >
            Build my first roster
            <svg className="size-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#c8cbc2] bg-white/60 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white sm:w-auto"
            href="#demo"
          >
            <span className="grid size-5 place-items-center rounded-full bg-[#d9ff57]">
              <svg className="ml-0.5 size-2.5" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true"><path d="M9 6 1 11V1l8 5Z" /></svg>
            </span>
            Watch 60-sec demo
          </a>
        </div>

        <div className="relative mt-5 flex items-center gap-4 text-xs font-medium text-[#6d7773]">
          <span className="flex items-center gap-1.5"><span className="text-[#6ba96f]">&#10003;</span> No credit card</span>
          <span className="size-1 rounded-full bg-[#b9bcb4]" />
          <span className="flex items-center gap-1.5"><span className="text-[#6ba96f]">&#10003;</span> Free for 14 days</span>
        </div>

        <div
          id="product"
          role="img"
          aria-label="Rosterly dashboard showing an automatically generated weekly staff roster"
          className="relative mt-16 w-full max-w-[1080px] rounded-[26px] border border-[#d6d4c9] bg-[#18221f] p-2 shadow-[0_40px_100px_rgba(39,48,44,0.22)] sm:mt-20 sm:rounded-[34px] sm:p-3"
        >
          <div className="absolute -left-5 top-24 hidden w-44 -rotate-3 rounded-2xl border border-[#d9d8ce] bg-white p-3.5 text-left shadow-xl lg:block">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#78817d]">Smart check</span>
              <span className="grid size-5 place-items-center rounded-full bg-[#d9ff57] text-xs">&#10003;</span>
            </div>
            <p className="text-sm font-semibold leading-tight">Every shift is covered</p>
            <p className="mt-1 text-[10px] leading-4 text-[#7b8480]">0 conflicts &middot; 164 hours</p>
          </div>

          <div className="absolute -right-5 bottom-20 z-10 hidden w-48 rotate-2 rounded-2xl bg-[#d9ff57] p-4 text-left shadow-xl lg:block">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-[#17211e] text-white">
                <svg className="size-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10.5 8 14l8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div><p className="text-xs font-bold">Roster ready</p><p className="text-[10px] text-[#4d5d39]">Built in 12 seconds</p></div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[19px] bg-[#f9f9f6] text-left sm:rounded-[24px]">
            <div className="flex h-12 items-center justify-between border-b border-[#e6e6df] px-4 sm:h-16 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <LogoMark small />
                <span className="hidden text-sm font-semibold sm:block">rosterly</span>
                <span className="hidden h-4 w-px bg-[#d9d9d2] sm:block" />
                <span className="text-xs font-medium text-[#707a76] sm:text-sm">North Street Studio</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden rounded-lg border border-[#ddddD6] bg-white px-3 py-2 text-xs font-semibold sm:block" type="button">Save draft</button>
                <button className="rounded-lg bg-[#17211e] px-3 py-2 text-[10px] font-semibold text-white sm:px-4 sm:text-xs" type="button">Publish roster</button>
                <span className="grid size-8 place-items-center rounded-full bg-[#f8d9b7] text-[9px] font-bold sm:size-9 sm:text-xs">SA</span>
              </div>
            </div>

            <div className="flex min-h-[330px] sm:min-h-[470px]">
              <aside className="hidden w-48 shrink-0 border-r border-[#e8e8e2] p-4 sm:block lg:w-56 lg:p-5">
                <p className="px-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#969d99]">Workspace</p>
                <div className="mt-3 space-y-1 text-xs font-medium">
                  <div className="flex items-center gap-2.5 rounded-lg bg-[#e9f0ec] px-2.5 py-2.5 text-[#17211e]">
                    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 8h14M7 2.5v3M13 2.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Roster
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-2.5 text-[#717b77]">
                    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.5 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM13.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.5 17c.2-3.2 1.8-5 5-5s4.8 1.8 5 5M11 13c.7-.6 1.5-.9 2.7-.9 2.8 0 4.1 1.7 4.3 4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Team
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-2.5 text-[#717b77]">
                    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 14.5V10m4 4.5V6m4 8.5V8m4 6.5V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                    Insights
                  </div>
                </div>

                <div className="mt-8 rounded-xl border border-[#e2e3dc] bg-white p-3">
                  <div className="flex -space-x-1.5">
                    {team.map((person) => (
                      <span key={person.initials} className={`grid size-7 place-items-center rounded-full border-2 border-white text-[8px] font-bold ${person.color}`}>{person.initials}</span>
                    ))}
                  </div>
                  <p className="mt-2.5 text-xs font-semibold">8 teammates</p>
                  <p className="mt-0.5 text-[10px] text-[#818985]">All availability is in</p>
                </div>
              </aside>

              <div className="min-w-0 flex-1 p-3 sm:p-5 lg:p-7">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#86908b] sm:text-[10px]">Weekly roster</p>
                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] sm:text-2xl">September 14 &ndash; 18</h2>
                  </div>
                  <div className="hidden items-center gap-1 rounded-lg border border-[#dfdfd8] bg-white p-1 text-[10px] font-semibold md:flex">
                    <button className="rounded-md px-2 py-1.5 text-[#707a76]" type="button">&lsaquo;</button>
                    <button className="rounded-md bg-[#f0f0eb] px-3 py-1.5" type="button">Today</button>
                    <button className="rounded-md px-2 py-1.5 text-[#707a76]" type="button">&rsaquo;</button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-5 overflow-hidden rounded-t-xl border border-b-0 border-[#e0e1da] bg-white sm:mt-6">
                  {days.map((item, index) => (
                    <div key={item.day} className={`px-1 py-2 text-center sm:py-3 ${index < days.length - 1 ? "border-r border-[#e5e6df]" : ""}`}>
                      <p className="text-[7px] font-bold tracking-[0.1em] text-[#969d99] sm:text-[9px]">{item.day}</p>
                      <p className={`mt-0.5 text-xs font-semibold sm:text-sm ${index === 2 ? "mx-auto grid size-6 place-items-center rounded-full bg-[#d9ff57]" : ""}`}>{item.date}</p>
                    </div>
                  ))}
                </div>

                <div className="relative grid h-44 grid-cols-5 grid-rows-2 overflow-hidden rounded-b-xl border border-[#e0e1da] bg-white sm:h-60">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className={`${index % 5 !== 4 ? "border-r" : ""} ${index < 5 ? "border-b" : ""} border-[#ecece6]`} />
                  ))}
                  {shifts.map((shift, index) => (
                    <div
                      key={`${shift.person}-${shift.col}-${shift.row}`}
                      className={`absolute mx-1 mt-2 rounded-md border p-1.5 shadow-[0_2px_4px_rgba(30,40,36,0.04)] sm:mx-2 sm:mt-3 sm:rounded-lg sm:p-2.5 ${shift.tone}`}
                      style={{
                        left: `calc(${(Number(shift.col) - 1) * 20}% )`,
                        top: `calc(${(Number(shift.row) - 1) * 50}% )`,
                        width: "calc(20% - 8px)",
                      }}
                    >
                      <p className="truncate text-[7px] font-bold sm:text-[10px]">{shift.person}</p>
                      <p className="mt-0.5 hidden truncate text-[8px] text-[#58635e] sm:block">{shift.time}</p>
                      {index === 2 && <span className="absolute -right-1.5 -top-1.5 size-2.5 rounded-full border-2 border-white bg-[#6ba96f] sm:size-3" />}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-[#e1e2dc] bg-white px-3 py-2.5 sm:mt-4 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-full bg-[#e9f4ed] text-[#578265]">
                      <svg className="size-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10.5 3.5 3.5L16 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <div><p className="text-[9px] font-semibold sm:text-xs">Ready to publish</p><p className="hidden text-[9px] text-[#7c8581] sm:block">All rules and availability checked</p></div>
                  </div>
                  <p className="text-[9px] font-semibold text-[#66706c] sm:text-xs">164 hrs &middot; $4,920</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
