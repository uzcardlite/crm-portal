import { useCallback, useMemo, useState } from "react";
import { CalendarX, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import IconButton from "../components/ui/IconButton";
import ProgressRing from "../components/ui/ProgressRing";
import Skeleton from "../components/ui/Skeleton";
import LessonList from "../components/portal/LessonList";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import { getPortalAttendance } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { ATTENDANCE_CELL } from "../constants/portal";
import { MONTH_NAMES } from "../utils/format";
import { toIsoDate } from "../utils/portalSchedule";
import { cn } from "../utils/cn";

export default function PortalAttendance() {
  const { activeStudentId, activeStudent } = usePortalAuth();
  const today = useMemo(() => new Date(), []);
  const todayIso = toIsoDate(today);
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  // December -> January rolls the year in both directions.
  function shiftMonth(delta) {
    setCursor((current) => {
      const next = new Date(current.year, current.month - 1 + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() + 1 };
    });
  }

  const isFutureMonth =
    cursor.year > today.getFullYear() ||
    (cursor.year === today.getFullYear() && cursor.month >= today.getMonth() + 1);

  const enabled = Boolean(activeStudentId);
  const loadAttendance = useCallback(
    () => getPortalAttendance(activeStudentId, cursor.year, cursor.month),
    [activeStudentId, cursor.year, cursor.month],
  );
  const attendance = usePortalResource(loadAttendance, enabled);

  const lessons = useMemo(() => attendance.data?.lessons ?? [], [attendance.data]);

  // The summary is computed client-side from the month currently on screen, so
  // its heading names that month explicitly — it is not the home-page figure.
  // Only lessons that already happened AND were marked count: a lesson still
  // ahead is not an absence.
  const counts = useMemo(() => {
    const result = { present: 0, absent: 0, late: 0, total: 0 };
    lessons.forEach((lesson) => {
      if (!lesson.status || !(lesson.status in result)) return;
      if (lesson.date > todayIso) return;
      result[lesson.status] += 1;
      result.total += 1;
    });
    return result;
  }, [lessons, todayIso]);

  const upcoming = useMemo(
    () => lessons.filter((lesson) => lesson.date > todayIso).length,
    [lessons, todayIso],
  );

  // A lesson that has happened but carries no mark yet. Counted separately so
  // the three status figures below plus these add up to the month's lessons —
  // otherwise a parent sees a number missing and assumes the worst.
  const unmarked = useMemo(
    () => lessons.filter((lesson) => lesson.date <= todayIso && !lesson.status).length,
    [lessons, todayIso],
  );

  // Late still counts as attended — the child came to the lesson.
  const percent =
    counts.total === 0
      ? null
      : Math.round(((counts.present + counts.late) / counts.total) * 100);
  const monthLabel = `${MONTH_NAMES[cursor.month - 1]} ${cursor.year}`;

  return (
    <>
      <PortalPageHeader title="Davomat" subtitle={activeStudent?.full_name} />

      <div className="flex items-center justify-between">
        <IconButton
          icon={ChevronLeft}
          aria-label="Oldingi oy"
          onClick={() => shiftMonth(-1)}
        />
        <span className="text-sm font-medium text-fg">{monthLabel}</span>
        <IconButton
          icon={ChevronRight}
          aria-label="Keyingi oy"
          disabled={isFutureMonth}
          onClick={() => shiftMonth(1)}
        />
      </div>

      {attendance.loading ? (
        <>
          <Skeleton className="h-[104px] rounded-card" />
          <Card padding="p-4">
            <Skeleton className="h-4 w-full" />
            {Array.from({ length: 5 }, (_, row) => (
              <div key={row} className="mt-2 grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }, (_, cell) => (
                  <Skeleton key={cell} className="h-9 rounded-full" />
                ))}
              </div>
            ))}
          </Card>
        </>
      ) : attendance.error ? (
        <PortalErrorState onRetry={attendance.reload} />
      ) : lessons.length === 0 ? (
        <EmptyState
          size="sm"
          icon={CalendarX}
          title="Bu oyda dars yo'q"
          description={`${monthLabel} uchun dars kuni topilmadi.`}
        />
      ) : (
        <>
          <Card padding="p-4">
            <div className="flex items-center gap-4">
              <ProgressRing value={percent} size={72}>
                {percent !== null ? `${percent}%` : null}
              </ProgressRing>
              <div className="flex-1 space-y-1.5">
                <p className="text-xs text-fg-muted">
                  {monthLabel} · {lessons.length} dars
                  {upcoming > 0 ? ` · ${upcoming} tasi oldinda` : ""}
                  {unmarked > 0 ? ` · ${unmarked} tasi belgilanmagan` : ""}
                </p>
                {Object.entries(ATTENDANCE_CELL).map(([status, cell]) => (
                  <div key={status} className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-fg-muted">
                      <span className={cn("h-3 w-3 rounded-full", cell.className)} />
                      {cell.label}
                    </span>
                    <span className="font-semibold tabular-nums text-fg">
                      {counts[status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <LessonList lessons={lessons} todayIso={todayIso} />
        </>
      )}
    </>
  );
}
