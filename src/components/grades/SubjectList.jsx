import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SectionHeader from "../ui/SectionHeader";
import { GraduationCap } from "lucide-react";
import { cn } from "../../utils/cn";

// Subjects strongest first, each with which way it moved. "How much" alone
// tells a parent where the child is; the delta tells them where they are going.
const HUE = {
  teal: { swatch: "bg-teal", bar: "bg-teal" },
  sky: { swatch: "bg-sky", bar: "bg-sky" },
  carrot: { swatch: "bg-carrot-bright", bar: "bg-carrot-bright" },
  amber: { swatch: "bg-amber", bar: "bg-amber" },
  rose: { swatch: "bg-rose", bar: "bg-rose" },
};

export default function SubjectList({ subjects = [] }) {
  return (
    <Card>
      <SectionHeader
        title="Fanlar bo'yicha"
        aside={subjects.length > 0 ? `${subjects.length} ta fan` : null}
      />

      {subjects.length === 0 ? (
        <EmptyState icon={GraduationCap} text="Bu davrda baho qo'yilmagan" />
      ) : (
        <div className="mt-1">
          {subjects.map((subject) => {
            const hue = HUE[subject.hue] || HUE.carrot;
            return (
              <div
                key={subject.subject}
                className="flex items-center gap-2.5 border-b border-line py-[9px] last:border-b-0"
              >
                <span className={cn("h-[26px] w-1 flex-none rounded-sm", hue.swatch)} />

                <span className="min-w-0 flex-1">
                  <b className="block truncate text-[11px] font-bold text-ink">{subject.subject}</b>
                  <span className="mt-px block truncate text-[8.5px] font-semibold text-ink-faint">
                    {subject.count} ta baho
                    {subject.teacher ? ` · ${subject.teacher}` : ""}
                  </span>
                </span>

                <span className="h-1 w-[52px] flex-none overflow-hidden rounded-full bg-white/[.07]">
                  <i
                    className={cn("block h-full rounded-full", hue.bar)}
                    style={{ width: `${Math.max(0, Math.min(100, subject.percent))}%` }}
                  />
                </span>

                <span className="w-[26px] flex-none text-right font-display text-[13px] font-bold tracking-tight text-ink tnum">
                  {subject.percent}
                </span>

                <span
                  className={cn(
                    "w-[22px] flex-none text-right text-[8.5px] font-extrabold tnum",
                    subject.delta === null && "text-ink-faint",
                    subject.delta > 0 && "text-teal",
                    subject.delta < 0 && "text-rose",
                    subject.delta === 0 && "text-ink-faint",
                  )}
                >
                  {subject.delta === null
                    ? "—"
                    : subject.delta === 0
                      ? "0"
                      : `${subject.delta > 0 ? "+" : ""}${subject.delta}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
