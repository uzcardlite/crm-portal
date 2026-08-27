import { cn } from "../../utils/cn";

// Bu oy / Chorak / Yil. Shared by Baholash and Davomat so the two read as one
// screen with different content rather than two different screens.
export default function PeriodSegment({ periods, value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {periods.map((period) => (
        <button
          key={period.key}
          type="button"
          onClick={() => onChange(period.key)}
          aria-pressed={period.key === value}
          className={cn(
            "flex-1 rounded-[10px] border px-1 py-[7px] text-[10px] font-bold transition-colors",
            period.key === value
              ? "border-carrot/[.32] bg-carrot/[.14] text-carrot-bright"
              : "border-line bg-surface text-ink-faint",
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
