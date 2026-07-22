import { cn } from "../../utils/cn";

// days: [{ iso, weekday, day, hasLesson, isToday }]
export default function DayStrip({ days = [], activeIso, onSelect }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {days.map((entry) => {
        const isActive = entry.iso === activeIso;
        return (
          <button
            key={entry.iso}
            type="button"
            onClick={() => onSelect(entry.iso)}
            aria-pressed={isActive}
            className={cn(
              "flex h-14 w-12 flex-shrink-0 flex-col items-center justify-center rounded-card border transition-colors",
              isActive
                ? "border-accent bg-accent-light/40 text-accent-dark"
                : "border-gray-200 bg-white text-gray-600",
              // Today keeps a ring while another day is selected.
              !isActive && entry.isToday && "ring-1 ring-accent",
            )}
          >
            <span className="text-[11px] font-medium">{entry.weekday}</span>
            <span className="text-sm font-semibold tabular-nums">{entry.day}</span>
            {entry.hasLesson && <span className="mt-0.5 h-1 w-1 rounded-full bg-accent" />}
          </button>
        );
      })}
    </div>
  );
}
