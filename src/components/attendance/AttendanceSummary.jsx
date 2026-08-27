import Ring from "../ui/Ring";
import Skeleton from "../ui/Skeleton";
import { cn } from "../../utils/cn";

// Green here, carrot on Baholash — the two screens are told apart before a
// word is read. Beside the ring, the three counts that add up to it.
function Count({ swatch, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <i className={cn("h-2 w-2 flex-none rounded-full", swatch)} />
      <span className="flex-1 text-[10px] font-bold text-ink-soft">{label}</span>
      <span className="font-display text-[15px] font-bold tracking-tight text-ink tnum">
        {value}
      </span>
    </div>
  );
}

export default function AttendanceSummary({ summary, loading }) {
  if (loading) return <Skeleton className="h-[122px] rounded-card" />;

  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-surface p-[15px]">
      <span
        aria-hidden="true"
        className="absolute -right-12 -top-14 h-[150px] w-[150px] rounded-full bg-[radial-gradient(circle,rgba(52,201,163,.22),transparent_70%)]"
      />
      <div className="relative flex items-center gap-[15px]">
        <Ring
          size="lg"
          hue="teal"
          percent={summary.percent ?? 0}
          value={summary.percent ?? 0}
          unit="%"
          label="davomat"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Count swatch="bg-carrot-bright" label="Keldi" value={summary.present} />
          <Count swatch="border-2 border-amber" label="Kechikdi" value={summary.late} />
          <Count swatch="border-2 border-rose" label="Kelmadi" value={summary.absent} />
        </div>
      </div>
    </div>
  );
}
