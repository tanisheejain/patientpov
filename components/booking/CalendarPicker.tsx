import { useMemo } from "react";

type CalendarDay = {
  key: string;
  date: Date;
  dayOfMonth: number;
  inMonth: boolean;
};

export function CalendarPicker(props: {
  month: Date; // any date within month
  selectedDate: Date | null;
  availableDateKeys: Set<string>;
  onSelectDate: (date: Date) => void;
}) {
  const grid = useMemo(() => buildMonthGrid(props.month), [props.month]);
  const monthLabel = props.month.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{monthLabel}</div>
        <div className="text-xs text-black/60">Select a day</div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-black/55">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-1 py-1 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {grid.map((d) => {
          const key = toDateKey(d.date);
          const available = d.inMonth && props.availableDateKeys.has(key);
          const selected =
            props.selectedDate && toDateKey(props.selectedDate) === key;

          return (
            <button
              key={d.key}
              type="button"
              disabled={!available}
              onClick={() => props.onSelectDate(d.date)}
              className={[
                "h-10 rounded-2xl border text-sm transition",
                d.inMonth ? "text-black" : "text-black/30",
                available
                  ? "border-black/10 bg-white hover:bg-black/[0.02]"
                  : "border-black/5 bg-white/60",
                selected
                  ? "ring-2 ring-[#A3BCFB]/70 border-transparent bg-gradient-to-br from-[rgba(254,162,88,0.18)] to-[rgba(163,188,251,0.20)]"
                  : null,
                !available ? "cursor-not-allowed opacity-60" : null,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={`${
                available ? "Available" : "Unavailable"
              } ${d.date.toDateString()}`}
            >
              {d.dayOfMonth}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthGrid(month: Date): CalendarDay[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const startDow = first.getDay(); // 0=Sun
  const start = new Date(year, m, 1 - startDow);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const inMonth = date.getMonth() === m;
    days.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      dayOfMonth: date.getDate(),
      inMonth,
    });
  }
  return days;
}

