import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { CalendarX } from "lucide-react";
import { cn } from "../../utils/cn";

// The same thread the home screen shows, with the month it belongs to made
// steerable — a parent asking "and last month?" has somewhere to press.
const NODE = {
  present: "bg-carrot-bright shadow-glow-sm",
  late: "bg-surface border-2 border-amber",
  absent: "bg-surface border-2 border-rose",
  upcoming: "bg-transparent border-[1.5px] border-dashed border-white/[.22]",
};

function connectorFor(status) {
  if (status === "absent") return "border-t-2 border-dotted border-rose/50";
  if (status === "upcoming") return "border-t-2 border-dotted border-white/[.15]";
  return "h-0.5 bg-carrot-bright/45";
}

function Legend({ className, children }) {
  return (
    <span className="flex items-center gap-1.5 text-[8.5px] font-bold text-ink-faint">
      <i className={cn("h-[7px] w-[7px] rounded-full", className)} />
      {children}
    </span>
  );
}

export default function MonthThread({ days = [], monthLabel, canGoForward, onBack, onForward }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Oldingi oy"
          className="grid h-6 w-6 place-items-center rounded-btn border border-line bg-black/[.24] text-ink-soft"
        >
          <ChevronLeft size={11} strokeWidth={2.6} />
        </button>
        <span className="text-[11.5px] font-extrabold text-ink">{monthLabel}</span>
        <button
          type="button"
          onClick={onForward}
          disabled={!canGoForward}
          aria-label="Keyingi oy"
          className="grid h-6 w-6 place-items-center rounded-btn border border-line bg-black/[.24] text-ink-soft disabled:opacity-35"
        >
          <ChevronRight size={11} strokeWidth={2.6} />
        </button>
      </div>

      {days.length === 0 ? (
        <EmptyState icon={CalendarX} text="Bu oyda dars kuni yo'q" />
      ) : (
        <>
          <div className="mt-3.5 flex items-center">
            {days.map((day, index) => (
              <span key={day.date} className="contents">
                {index > 0 && (
                  <span aria-hidden="true" className={cn("flex-1", connectorFor(day.status))} />
                )}
                <span
                  title={day.label}
                  className={cn("h-2.5 w-2.5 flex-none rounded-full", NODE[day.status])}
                />
              </span>
            ))}
          </div>

          <div className="mt-[7px] flex">
            {days.map((day, index) => (
              <span
                key={day.date}
                className={cn(
                  "text-center text-[7.5px] font-bold text-ink-faint tnum",
                  index === 0 || index === days.length - 1 ? "flex-none basis-[15px]" : "flex-1",
                )}
              >
                {day.day}
              </span>
            ))}
          </div>

          <div className="mt-[11px] flex flex-wrap gap-[11px] border-t border-line pt-2.5">
            <Legend className="bg-carrot-bright">Keldi</Legend>
            <Legend className="border-2 border-amber">Kechikdi</Legend>
            <Legend className="border-2 border-rose">Kelmadi</Legend>
            <Legend className="border-[1.5px] border-dashed border-white/30">Oldinda</Legend>
          </div>
        </>
      )}
    </Card>
  );
}
