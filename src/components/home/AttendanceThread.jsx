import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { CalendarX } from "lucide-react";
import { cn } from "../../utils/cn";

// The month's lesson days strung on one thread. A day the child missed breaks
// the thread rather than just recolouring a dot — the gap is the message.
const NODE = {
  present: "bg-carrot-bright shadow-glow-sm",
  late: "bg-surface border-2 border-amber",
  absent: "bg-surface border-2 border-rose",
  upcoming: "bg-transparent border-[1.5px] border-dashed border-white/[.22]",
};

// The link INTO a day is drawn by the day before it, so a break belongs to the
// absence rather than to whichever neighbour happens to come first.
function connectorFor(status) {
  if (status === "absent") return "border-t-2 border-dotted border-rose/50";
  if (status === "upcoming") return "border-t-2 border-dotted border-white/[.15]";
  return "h-0.5 bg-carrot-bright/45";
}

export default function AttendanceThread({ days = [], present, total, streak }) {
  if (days.length === 0) {
    return (
      <Card>
        <EmptyState icon={CalendarX} text="Bu oyda dars kuni yo'q" />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-ink">Davomat · shu oy</span>
        <span className="font-display text-[13px] font-bold tracking-tight text-ink tnum">
          {present}
          <small className="text-[9.5px] font-semibold text-ink-faint"> / {total}</small>
        </span>
      </div>

      {streak > 1 && (
        <span className="mt-[7px] inline-flex items-center gap-1.5 rounded-full bg-carrot/[.14] px-2 py-[3px] text-[9px] font-bold text-carrot-bright">
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
              className={cn("h-[9px] w-[9px] flex-none rounded-full", NODE[day.status])}
            />
          </span>
        ))}
      </div>

      <div className="mt-1.5 flex">
        {days.map((day, index) => (
          <span
            key={day.date}
            className={cn(
              "text-center text-[7.5px] font-bold text-ink-faint tnum",
              index === 0 || index === days.length - 1 ? "flex-none basis-3.5" : "flex-1",
            )}
          >
            {day.day}
          </span>
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-[11px] border-t border-line pt-[9px]">
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
    <span className="flex items-center gap-1.5 text-[8.5px] font-bold text-ink-faint">
      <i className={cn("h-[7px] w-[7px] rounded-full", className)} />
      {children}
    </span>
  );
}
