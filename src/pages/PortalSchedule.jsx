import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarX } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import DayStrip from "../components/portal/DayStrip";
import LessonCard from "../components/portal/LessonCard";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import SectionHeader from "../components/portal/SectionHeader";
import { getPortalSchedule } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { DAY_LABELS } from "../constants/portal";
import { formatDate } from "../utils/format";
import {
  dayKeyFromDate,
  hueIndexForId,
  lessonTimeRange,
  lessonsForDayKey,
  toIsoDate,
} from "../utils/portalSchedule";

// Monday-first current week.
function currentWeekDates(today) {
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

export default function PortalSchedule() {
  const { activeStudentId, activeStudent } = usePortalAuth();
  const today = useMemo(() => new Date(), []);
  const todayIso = toIsoDate(today);
  const [selectedIso, setSelectedIso] = useState(todayIso);

  const enabled = Boolean(activeStudentId);
  const loadSchedule = useCallback(() => getPortalSchedule(activeStudentId), [activeStudentId]);
  const schedule = usePortalResource(loadSchedule, enabled);

  const items = useMemo(() => schedule.data ?? [], [schedule.data]);

  const weekDays = useMemo(
    () =>
      currentWeekDates(today).map((date) => {
        const iso = toIsoDate(date);
        const dayKey = dayKeyFromDate(date);
        return {
          iso,
          weekday: DAY_LABELS[dayKey],
          day: date.getDate(),
          isToday: iso === todayIso,
          hasLesson: items.some(
            (item) => Array.isArray(item.days) && item.days.includes(dayKey),
          ),
        };
      }),
    [items, today, todayIso],
  );

  // Built from parts, not `new Date(iso)` — the string form is parsed as UTC
  // and would name the wrong weekday/date in some timezones.
  const selectedDate = useMemo(() => {
    const [year, month, day] = selectedIso.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [selectedIso]);

  const selectedLessons = useMemo(
    () => lessonsForDayKey(items, dayKeyFromDate(selectedDate)),
    [items, selectedDate],
  );

  // Groups the student belongs to that have no weekday set at all — they can
  // never appear under a day, so they get their own explicit block.
  const unscheduled = useMemo(
    () => items.filter((item) => !Array.isArray(item.days) || item.days.length === 0),
    [items],
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          to="/"
          aria-label="Orqaga"
          className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-btn text-gray-500 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <PortalPageHeader title="Dars jadvali" subtitle={activeStudent?.full_name} />
      </div>

      {schedule.loading ? (
        <>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-12 flex-shrink-0 rounded-card" />
            ))}
          </div>
          <Card padding="p-4">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="mt-3 h-16 rounded-card" />
            ))}
          </Card>
        </>
      ) : schedule.error ? (
        <PortalErrorState onRetry={schedule.reload} />
      ) : (
        <>
          <DayStrip days={weekDays} activeIso={selectedIso} onSelect={setSelectedIso} />

          <Card padding="p-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-gray-900">{formatDate(selectedDate)}</p>
              {selectedLessons.length === 0 ? (
                <EmptyState size="sm" icon={CalendarX} title="Bu kuni dars yo'q" />
              ) : (
                selectedLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.group_id}
                    time={lessonTimeRange(lesson.time, lesson.duration_minutes)}
                    groupName={lesson.group_name}
                    teacherName={lesson.teacher_name}
                    roomName={lesson.room_name}
                    colorIndex={hueIndexForId(lesson.group_id)}
                  />
                ))
              )}
            </div>
          </Card>

          {unscheduled.length > 0 && (
            <Card padding="p-4">
              <div className="flex flex-col gap-3">
                <SectionHeader title="Jadvalsiz guruhlar" count={unscheduled.length} />
                <div>
                  {unscheduled.map((item) => (
                    <div
                      key={item.group_id}
                      className="border-b border-gray-50 py-3 last:border-0"
                    >
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.group_name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">Jadval belgilanmagan</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </>
  );
}
