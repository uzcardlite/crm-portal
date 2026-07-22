import { useCallback, useMemo, useState } from "react";
import { CalendarX, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import IconButton from "../components/ui/IconButton";
import ProgressRing from "../components/ui/ProgressRing";
import Skeleton from "../components/ui/Skeleton";
import AttendanceCalendar from "../components/portal/AttendanceCalendar";
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

  const days = useMemo(() => attendance.data?.days ?? {}, [attendance.data]);

  // The summary is computed client-side from the month currently on screen, so
  // its heading names that month explicitly — it is not the home-page figure.
  const counts = useMemo(() => {
    const result = { present: 0, absent: 0, late: 0, total: 0 };
    Object.values(days).forEach((status) => {
      if (!status || !(status in result)) return;
      result[status] += 1;
      result.total += 1;
    });
    return result;
  }, [days]);

  const percent = counts.total === 0 ? null : Math.round((counts.present / counts.total) * 100);
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
        <span className="text-sm font-medium text-gray-900">{monthLabel}</span>
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
      ) : counts.total === 0 ? (
        <EmptyState
          size="sm"
          icon={CalendarX}
          title="Bu oyda davomat belgilanmagan"
          description={`${monthLabel} uchun dars qayd etilmagan.`}
        />
      ) : (
        <>
          <Card padding="p-4">
            <div className="flex items-center gap-4">
              <ProgressRing value={percent} size={72}>
                {percent !== null ? `${percent}%` : null}
              </ProgressRing>
              <div className="flex-1 space-y-1.5">
                <p className="text-xs text-gray-500">{monthLabel} xulosasi</p>
                {Object.entries(ATTENDANCE_CELL).map(([status, cell]) => (
                  <div key={status} className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-gray-500">
                      <span className={cn("h-3 w-3 rounded-full", cell.className)} />
                      {cell.label}
                    </span>
                    <span className="font-semibold tabular-nums text-gray-900">
                      {counts[status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card padding="p-4">
            <AttendanceCalendar
              year={cursor.year}
              month={cursor.month}
              days={days}
              todayIso={todayIso}
            />
          </Card>
        </>
      )}
    </>
  );
}
