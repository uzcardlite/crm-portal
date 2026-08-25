import Ring from "../ui/Ring";
import Skeleton from "../ui/Skeleton";
import { cn } from "../../utils/cn";

// One big ring and the two facts a parent would ask for next: the familiar
// five-point average, and how many marks it was built from — an 87% off three
// marks is not the same claim as an 87% off twenty-four.
function Fact({ label, value, unit }) {
  return (
    <div>
      <div className="text-[8.5px] font-bold uppercase tracking-[.07em] text-ink-faint">
        {label}
      </div>
      <div className="mt-0.5 font-display text-[17px] font-bold leading-none tracking-tight text-ink tnum">
        {value}
        {unit && <small className="text-[10px] font-semibold text-ink-faint">{unit}</small>}
      </div>
    </div>
  );
}

export default function MasteryCard({ percent, average5, total, delta, loading }) {
  if (loading) return <Skeleton className="h-[122px] rounded-card" />;

  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-surface p-[15px]">
      <span
        aria-hidden="true"
        className="absolute -right-12 -top-14 h-[150px] w-[150px] rounded-full bg-[radial-gradient(circle,rgba(236,138,69,.28),transparent_70%)]"
      />
      <div className="relative flex items-center gap-[15px]">
        <Ring
          size="lg"
          hue="carrot"
          percent={percent ?? 0}
          value={percent ?? 0}
          unit="%"
          label="o'zlash."
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
          <Fact label="O'rtacha baho" value={average5 ?? "—"} unit={average5 ? "/5.0" : null} />
          <Fact label="Jami baholar" value={total} unit=" ta" />
          {typeof delta === "number" && delta !== 0 && (
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1 rounded-full px-2 py-[3px] text-[9.5px] font-extrabold",
                delta > 0 ? "bg-teal/15 text-teal" : "bg-rose/15 text-rose",
              )}
            >
              {delta > 0 ? "↑" : "↓"} o'tgan davrdan {delta > 0 ? "+" : ""}
              {delta}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
