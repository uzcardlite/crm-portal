import {
  ATTENDANCE_CELL,
  ATTENDANCE_EMPTY_CLASS,
  TODAY_RING_CLASS,
  WEEKDAY_HEADER,
} from "../../constants/portal";
import { cn } from "../../utils/cn";

// Monday-first offset for the 1st of the month (JS getDay(): 0 = Sunday).
function leadingBlanks(year, month) {
  const weekday = new Date(year, month - 1, 1).getDay();
  return (weekday + 6) % 7;
}

function isoFor(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AttendanceCalendar({ year, month, days = {}, todayIso }) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const blanks = leadingBlanks(year, month);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-gray-400">
        {WEEKDAY_HEADER.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: blanks }, (_, index) => (
          <div key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const iso = isoFor(year, month, day);
          const status = days[iso];
          const cell = status ? ATTENDANCE_CELL[status] : null;
          return (
            <div
              key={iso}
              title={cell ? cell.label : undefined}
              className={cn(
                "flex h-9 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                cell ? cell.className : ATTENDANCE_EMPTY_CLASS,
                iso === todayIso && TODAY_RING_CLASS,
              )}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(ATTENDANCE_CELL).map(([status, cell]) => (
          <span
            key={status}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500"
          >
            <span className={cn("h-3 w-3 rounded-full", cell.className)} />
            {cell.label}
          </span>
        ))}
      </div>
    </div>
  );
}
