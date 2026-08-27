import Card from "../ui/Card";
import Ring from "../ui/Ring";
import Skeleton from "../ui/Skeleton";
import { cn } from "../../utils/cn";

// Mastery and behaviour, side by side and the same size — neither is the
// headline. Behaviour is scored out of 5.0 and loses 0.1 per point a teacher
// takes off, so the ring fills on the same scale the number is read on.
function RingCard({ children, label, note, tone }) {
  return (
    <Card className="flex flex-col items-center gap-[10px] px-2.5 pb-3.5 pt-4">
      {children}
      <span className="text-[11.5px] font-bold text-ink">{label}</span>
      {note && (
        <span
          className={cn(
            "-mt-1.5 text-[9.5px] font-semibold",
            tone === "up" && "text-teal",
            tone === "down" && "text-rose",
            !tone && "text-ink-faint",
          )}
        >
          {note}
        </span>
      )}
    </Card>
  );
}

export default function StatRings({ mastery, behaviour, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        <Skeleton className="h-[150px] rounded-card" />
        <Skeleton className="h-[150px] rounded-card" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <RingCard label="Baholar" note={mastery?.note} tone={mastery?.tone}>
        <Ring
          size="md"
          hue="carrot"
          percent={mastery?.percent ?? 0}
          value={mastery?.percent ?? 0}
          unit="%"
          label="o'zlash."
        />
      </RingCard>

      <RingCard label="Axloq" note={behaviour?.note} tone={behaviour?.tone}>
        <Ring
          size="md"
          hue="amber"
          // 4.7 of 5.0 fills 94% — the arc and the number always agree.
          percent={((behaviour?.score ?? 0) / 5) * 100}
          value={(behaviour?.score ?? 0).toFixed(1)}
          label="5.0 dan"
        />
      </RingCard>
    </div>
  );
}
