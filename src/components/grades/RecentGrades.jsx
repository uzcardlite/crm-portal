import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SectionHeader from "../ui/SectionHeader";
import { ClipboardList } from "lucide-react";
import { cn } from "../../utils/cn";
import { formatDate } from "../../utils/format";

// A mark on its own says nothing a parent can act on. Each row carries the
// subject, what the mark was for, and who gave it — that is the conversation
// they will have with their child tonight.
function badgeTone(percent) {
  if (percent === null) return "bg-white/[.06] text-ink-soft";
  if (percent >= 90) return "bg-teal/15 text-teal";
  if (percent >= 80) return "bg-carrot/15 text-carrot-bright";
  if (percent >= 70) return "bg-amber/15 text-amber";
  return "bg-rose/15 text-rose";
}

// Today's mark wants a time-free "Bugun"; last week's wants its date.
function when(date, todayIso) {
  if (date === todayIso) return "Bugun";
  const days = Math.round((new Date(todayIso) - new Date(date)) / 86400000);
  if (days === 1) return "Kecha";
  if (days < 7) return `${days} kun`;
  return formatDate(date);
}

export default function RecentGrades({ grades = [], teacherOf = {} }) {
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <Card>
      <SectionHeader title="So'nggi baholar" aside={grades.length > 0 ? "Hammasi →" : null} />

      {grades.length === 0 ? (
        <EmptyState icon={ClipboardList} text="Bu davrda baho qo'yilmagan" />
      ) : (
        <div className="mt-1">
          {grades.map((grade) => (
            <div
              key={grade.id}
              className="flex items-center gap-2.5 border-b border-line py-[9px] last:border-b-0"
            >
              <span
                className={cn(
                  "grid h-[34px] w-[34px] flex-none place-items-center rounded-[12px] font-display text-[13px] font-bold tracking-tight tnum",
                  badgeTone(grade.percent),
                )}
              >
                {grade.percent === null ? grade.score : Math.round(grade.percent)}
              </span>

              <span className="min-w-0 flex-1">
                <b className="block truncate text-[10.5px] font-bold text-ink">
                  {grade.subject} · {grade.title}
                </b>
                <span className="mt-0.5 block truncate text-[8.5px] font-semibold text-ink-faint">
                  {grade.max ? `${grade.score} / ${grade.max}` : `${grade.score} ball`}
                  {teacherOf[grade.subject] ? ` · ${teacherOf[grade.subject]}` : ""}
                </span>
              </span>

              <span className="flex-none text-[8.5px] font-bold text-ink-faint">
                {when(grade.date, todayIso)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
