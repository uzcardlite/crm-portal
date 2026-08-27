import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SectionHeader from "../ui/SectionHeader";
import { ArrowDown, ArrowUp, CalendarX } from "lucide-react";
import { cn } from "../../utils/cn";

// One row per lesson that has already happened, with the gate times under it.
// This is the block that turns "present" into "arrived at 13:52, left at 15:38".
const WEEKDAY = {
  mon: "Du", tue: "Se", wed: "Ch", thu: "Pa", fri: "Ju", sat: "Sh", sun: "Ya",
};

function statusOf(lesson) {
  if (lesson.status === "present") return { tone: "bg-teal/15 text-teal", label: "Keldi" };
  if (lesson.status === "late") {
    return {
      tone: "bg-amber/15 text-amber",
      label: lesson.lateBy ? `${lesson.lateBy} daq kech` : "Kechikdi",
    };
  }
  if (lesson.status === "absent") return { tone: "bg-rose/15 text-rose", label: "Kelmadi" };
  return { tone: "bg-black/25 text-ink-faint", label: "Belgilanmagan" };
}

export default function LessonRows({ rows = [], groups = [], filter, onFilter }) {
  const shown = filter ? rows.filter((lesson) => lesson.group_name === filter) : rows;

  return (
    <>
      {groups.length > 1 && (
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onFilter(null)}
            className={cn(
              "flex-1 rounded-[9px] border px-1 py-1.5 text-[9px] font-bold transition-colors",
              filter === null
                ? "border-carrot/30 bg-carrot/[.14] text-carrot-bright"
                : "border-line bg-surface text-ink-faint",
            )}
          >
            Barchasi
          </button>
          {groups.map((group) => (
            <button
              key={group.key}
              type="button"
              onClick={() => onFilter(group.key)}
              className={cn(
                "flex-1 truncate rounded-[9px] border px-1 py-1.5 text-[9px] font-bold transition-colors",
                filter === group.key
                  ? "border-carrot/30 bg-carrot/[.14] text-carrot-bright"
                  : "border-line bg-surface text-ink-faint",
              )}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}

      <Card>
        <SectionHeader title="Dars kunlari" aside={shown.length > 0 ? `${shown.length} ta` : null} />

        {shown.length === 0 ? (
          <EmptyState icon={CalendarX} text="Bu oyda o'tgan dars yo'q" />
        ) : (
          <div className="mt-1">
            {shown.map((lesson) => {
              const status = statusOf(lesson);
              const day = Number(String(lesson.date).slice(8, 10));
              return (
                <div
                  key={`${lesson.group_id}-${lesson.date}`}
                  className="flex gap-[11px] border-b border-line py-2.5 last:border-b-0"
                >
                  <span className="w-8 flex-none text-center">
                    <b className="block font-display text-[15px] font-bold leading-none tracking-tight text-ink tnum">
                      {day}
                    </b>
                    <span className="mt-0.5 block text-[7.5px] font-bold uppercase text-ink-faint">
                      {WEEKDAY[lesson.weekday] || ""}
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-[10.5px] font-bold text-ink">
                      {lesson.group_name}
                    </b>
                    {lesson.time && (
                      <span className="mt-px block text-[9px] font-semibold text-ink-faint">
                        {lesson.time}
                        {lesson.kind === "extra" && " · qo'shimcha dars"}
                        {lesson.kind === "moved" && lesson.moved_from &&
                          ` · ${Number(String(lesson.moved_from).slice(8, 10))}-sanadan ko'chirilgan`}
                      </span>
                    )}

                    {(lesson.gate?.in || lesson.gate?.out) && (
                      <span className="mt-[5px] flex items-center gap-[9px]">
                        {lesson.gate.in && (
                          <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-teal">
                            <ArrowDown size={9} strokeWidth={3} />
                            {lesson.gate.in}
                          </span>
                        )}
                        {lesson.gate.out && (
                          <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-ink-faint">
                            <ArrowUp size={9} strokeWidth={3} />
                            {lesson.gate.out}
                          </span>
                        )}
                      </span>
                    )}
                  </span>

                  <span
                    className={cn(
                      "flex-none self-start rounded-full px-[9px] py-1 text-[8.5px] font-extrabold",
                      status.tone,
                    )}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
