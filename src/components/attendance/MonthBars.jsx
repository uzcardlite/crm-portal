import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";
import { cn } from "../../utils/cn";

// Six months side by side. The month being viewed burns carrot, the rest stay
// green — the comparison is the point, not the individual figure.
export default function MonthBars({ months = [] }) {
  const hasData = months.some((month) => month.percent !== null);
  if (!hasData) return null;

  return (
    <Card>
      <SectionHeader title="Oylar bo'yicha" aside="6 oy" />
      <div className="mt-3 flex h-[62px] items-end gap-2">
        {months.map((month) => (
          <div key={month.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span
              className={cn(
                "text-[8px] font-extrabold tnum",
                month.current ? "text-carrot-bright" : "text-ink-faint",
              )}
            >
              {month.percent === null ? "—" : `${month.percent}%`}
            </span>
            <span className="relative h-full w-full max-w-4 overflow-hidden rounded-[5px] bg-white/[.07]">
              <i
                className={cn(
                  "absolute inset-x-0 bottom-0 rounded-[5px]",
                  month.current
                    ? "bg-[linear-gradient(180deg,#EC8A45,#D2712F)] shadow-glow"
                    : "bg-[linear-gradient(180deg,#34C9A3,rgba(52,201,163,.5))]",
                )}
                style={{ height: `${month.percent ?? 0}%` }}
              />
            </span>
            <span className="text-[7.5px] font-bold text-ink-faint">{month.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
