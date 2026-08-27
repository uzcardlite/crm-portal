import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { CalendarX } from "lucide-react";
import { cn } from "../../utils/cn";

// The month's lesson days strung on one thread. A day the child missed breaks
// the thread rather than just recolouring a dot — the gap is the message.
const NODE = {
  present: "bg-teal shadow-[0_0_8px_-1px_rgba(52,201,163,.8)]",
  late: "bg-surface border-2 border-amber",
  absent: "bg-surface border-2 border-rose",
  upcoming: "bg-transparent border-[1.5px] border-dashed border-white/[.22]",
};

// The link INTO a day is drawn by the day before it. Always a solid line —
// a parent reading this as "the thread snapped" would read worse than the
// truth, which is just "nothing happened here yet".
function connectorFor(status) {
  if (status === "absent") return "h-0.5 bg-rose/40";
  if (status === "upcoming") return "h-0.5 bg-white/[.14]";
  return "h-0.5 bg-teal/45";
}

export default function AttendanceThread({ days = [], present, total, streak }) {
  if (days.length === 0) {
    return (
      <Card>
        <EmptyState icon={CalendarX} text="Bu haftada dars kuni yo'q" />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-ink">Davomat · shu hafta</span>
        <span className="font-display text-[14px] font-bold tracking-tight text-ink tnum">
          {present}
          <small className="text-[10px] font-semibold text-ink-faint"> / {total}</small>
        </span>
      </div>

      {streak > 1 && (
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-carrot/[.14] px-2.5 py-1 text-[9.5px] font-bold text-carrot-bright">
          🔥 {streak} dars ketma-ket
        </span>
      )}

      <div className="mt-3 flex items-center">
        {days.map((day, index) => (
          <span key={day.date} className="contents">
            {index > 0 && (
              <span aria-hidden="true" className={cn("flex-1", connectorFor(day.status))} />
            )}
            <span
              title={day.label}
              className={cn("h-[10.5px] w-[10.5px] flex-none rounded-full", NODE[day.status])}
            />
          </span>
        ))}
      </div>

      <div className="mt-2 flex">
        {days.map((day, index) => (
          <span
            key={day.date}
            className={cn(
              "text-center text-[8.5px] font-bold text-ink-faint tnum",
              index === 0 || index === days.length - 1 ? "flex-none basis-4" : "flex-1",
            )}
          >
            {day.day}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 border-t border-line pt-2.5">
        <Legend className="bg-carrot-bright">Keldi</Legend>
        <Legend className="border-2 border-amber">Kechikdi</Legend>
        <Legend className="border-2 border-rose">Kelmadi</Legend>
        <Legend className="border-[1.5px] border-dashed border-white/30">Oldinda</Legend>
      </div>
    </Card>
  );
}

function Legend({ className, children }) {
  return (
    <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-ink-faint">
      <i className={cn("h-2 w-2 rounded-full", className)} />
      {children}
    </span>
  );
}
