import { ATTENDANCE_CELL } from "../../constants/portal";
import { cn } from "../../utils/cn";

const WEEKDAY_LABEL = {
  mon: "Du", tue: "Se", wed: "Ch", thu: "Pa", fri: "Ju", sat: "Sh", sun: "Ya",
};

const PILL = {
  present: "bg-success/15 text-success",
  absent: "bg-danger/15 text-danger",
  late: "bg-accent/20 text-accent-dark dark:text-accent",
};

// A month of the child's lessons, newest first. Parents used to get a calendar
// where the days that mattered were scattered among three weeks of blanks; this
// lists only the days their child actually had a lesson.
export default function LessonList({ lessons, todayIso }) {
  const ordered = [...lessons].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="flex flex-col gap-1.5">
      {ordered.map((lesson) => {
        const upcoming = lesson.date > todayIso;
        const label = lesson.status ? ATTENDANCE_CELL[lesson.status]?.label : null;
        return (
          <div
            key={`${lesson.group_id}-${lesson.date}`}
            className={cn(
              "flex items-center gap-3 rounded-card border border-line bg-surface px-3 py-2.5",
              upcoming && "border-dashed",
            )}
          >
            <div className="w-11 flex-shrink-0 text-center">
              <span className="block text-base font-bold leading-none tabular-nums text-fg">
                {Number(lesson.date.slice(8, 10))}
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase text-fg-faint">
                {WEEKDAY_LABEL[lesson.weekday] || ""}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-fg-secondary">
                {lesson.time ? `${lesson.time} — ` : ""}
                {lesson.group_name}
              </p>
              {lesson.kind === "extra" && (
                <p className="mt-0.5 text-[10px] font-bold text-success">+ Qo'shimcha dars</p>
              )}
              {lesson.kind === "moved" && lesson.moved_from && (
                <p className="mt-0.5 text-[10px] font-bold text-info">
                  ↷ {Number(lesson.moved_from.slice(8, 10))}-sanadan ko'chirilgan
                </p>
              )}
            </div>

            <span
              className={cn(
                "flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold",
                label ? PILL[lesson.status] : "bg-surface-sunken text-fg-muted",
              )}
            >
              {label || (upcoming ? "Bo'ladi" : "—")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
