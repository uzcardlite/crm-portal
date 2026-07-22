import { useCallback, useMemo, useState } from "react";
import { Banknote, CalendarCheck, CalendarX, GraduationCap } from "lucide-react";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ProgressRing from "../components/ui/ProgressRing";
import Skeleton from "../components/ui/Skeleton";
import ChildSwitcher from "../components/portal/ChildSwitcher";
import DayStrip from "../components/portal/DayStrip";
import EventRow from "../components/portal/EventRow";
import GradeRow from "../components/portal/GradeRow";
import LessonCard from "../components/portal/LessonCard";
import PaymentRow from "../components/portal/PaymentRow";
import PortalErrorState from "../components/portal/PortalErrorState";
import SectionHeader from "../components/portal/SectionHeader";
import {
  getPortalGrades,
  getPortalPayments,
  getPortalSchedule,
  getPortalSummary,
} from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { DAY_LABELS } from "../constants/portal";
import { formatDate, formatMoney, formatMonth } from "../utils/format";
import {
  dayKeyFromDate,
  hueIndexForId,
  lessonTimeRange,
  lessonsForDayKey,
  toIsoDate,
} from "../utils/portalSchedule";

const MAX_PREVIEW_ROWS = 3;

// Monday-first current week, used by the home DayStrip.
function currentWeekDays(today) {
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

export default function PortalHome() {
  const { students, activeStudentId, activeStudent, selectStudent } = usePortalAuth();
  const today = useMemo(() => new Date(), []);
  const todayIso = toIsoDate(today);
  const [selectedIso, setSelectedIso] = useState(todayIso);

  const enabled = Boolean(activeStudentId);
  const loadSummary = useCallback(() => getPortalSummary(activeStudentId), [activeStudentId]);
  const loadSchedule = useCallback(() => getPortalSchedule(activeStudentId), [activeStudentId]);
  const loadGrades = useCallback(() => getPortalGrades(activeStudentId), [activeStudentId]);
  const loadPayments = useCallback(() => getPortalPayments(activeStudentId), [activeStudentId]);

  const summary = usePortalResource(loadSummary, enabled);
  const schedule = usePortalResource(loadSchedule, enabled);
  const grades = usePortalResource(loadGrades, enabled);
  const payments = usePortalResource(loadPayments, enabled);

  const debt = summary.data?.debt;
  const recentEvents = summary.data?.recent_events ?? [];

  // Rule: a 0% with no attendance event behind it is "no data", not a score.
  const hasAttendanceData =
    Number(summary.data?.attendance_percent ?? 0) > 0 ||
    recentEvents.some((event) => event.type === "attendance");
  const attendancePercent = hasAttendanceData
    ? Number(summary.data?.attendance_percent ?? 0)
    : null;

  const weekDays = useMemo(() => {
    const scheduleItems = schedule.data ?? [];
    return currentWeekDays(today).map((date) => {
      const iso = toIsoDate(date);
      const dayKey = dayKeyFromDate(date);
      return {
        iso,
        weekday: DAY_LABELS[dayKey],
        day: date.getDate(),
        isToday: iso === todayIso,
        hasLesson: scheduleItems.some(
          (item) => Array.isArray(item.days) && item.days.includes(dayKey),
        ),
      };
    });
  }, [schedule.data, today, todayIso]);

  const selectedLessons = useMemo(() => {
    const [year, month, day] = selectedIso.split("-").map(Number);
    const dayKey = dayKeyFromDate(new Date(year, month - 1, day));
    return lessonsForDayKey(schedule.data, dayKey);
  }, [schedule.data, selectedIso]);

  const sortedGrades = useMemo(
    () => [...(grades.data ?? [])].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [grades.data],
  );

  // Average = sum(score) / sum(max_score); no max means no comparable average.
  const averagePercent = useMemo(() => {
    const totals = sortedGrades.reduce(
      (acc, grade) => {
        acc.score += Number(grade.score ?? 0);
        acc.max += Number(grade.max_score ?? 0);
        return acc;
      },
      { score: 0, max: 0 },
    );
    if (totals.max === 0) return null;
    return Math.min(100, Math.round((totals.score / totals.max) * 100));
  }, [sortedGrades]);

  const recentPayments = (payments.data?.history ?? []).slice(0, MAX_PREVIEW_ROWS);

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">Assalomu alaykum!</h1>
          <p className="mt-1 truncate text-sm text-gray-500">
            {activeStudent
              ? `${activeStudent.full_name} · ${activeStudent.tenant_name}`
              : ""}
          </p>
        </div>
        {summary.loading ? (
          <Skeleton className="h-6 w-24 rounded-full" />
        ) : debt ? (
          <Badge variant={debt.has_debt ? "danger" : "success"}>
            {debt.has_debt ? formatMoney(debt.amount) : "TO'LANGAN"}
          </Badge>
        ) : null}
      </div>

      <ChildSwitcher
        activeId={activeStudentId}
        onChange={selectStudent}
      >
        {students}
      </ChildSwitcher>

      {/* Two headline numbers: attendance this month and the grade average. */}
      {summary.loading || grades.loading ? (
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-[88px] rounded-card" />
          <Skeleton className="h-[88px] rounded-card" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Card padding="p-4">
            <div className="flex items-center gap-3">
              <ProgressRing value={attendancePercent} size={56}>
                {attendancePercent !== null ? `${attendancePercent}%` : null}
              </ProgressRing>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Davomat</p>
                <p className="text-xs text-gray-400">
                  {attendancePercent === null ? "Ma'lumot yo'q" : "Bu oy"}
                </p>
              </div>
            </div>
          </Card>
          <Card padding="p-4">
            <p className="text-2xl font-semibold tabular-nums text-gray-900">
              {averagePercent === null ? (
                <span className="text-gray-400">—</span>
              ) : (
                `${averagePercent}%`
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500">O'rtacha baho</p>
          </Card>
        </div>
      )}

      <Card padding="p-4">
        <div className="flex flex-col gap-3">
          <SectionHeader title="Dars jadvali" to="/schedule" />
          {schedule.loading ? (
            <>
              <Skeleton className="h-14 w-full rounded-card" />
              {Array.from({ length: MAX_PREVIEW_ROWS }, (_, index) => (
                <Skeleton key={index} className="h-16 rounded-card" />
              ))}
            </>
          ) : schedule.error ? (
            <PortalErrorState onRetry={schedule.reload} />
          ) : (
            <>
              <DayStrip days={weekDays} activeIso={selectedIso} onSelect={setSelectedIso} />
              {selectedLessons.length === 0 ? (
                <EmptyState
                  size="sm"
                  icon={CalendarX}
                  title={selectedIso === todayIso ? "Bugun dars yo'q" : "Bu kuni dars yo'q"}
                  description="Keyingi dars jadvalda ko'rsatilgan."
                />
              ) : (
                selectedLessons.slice(0, MAX_PREVIEW_ROWS).map((lesson) => (
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
            </>
          )}
        </div>
      </Card>

      <Card padding="p-4">
        <div className="flex flex-col gap-3">
          <SectionHeader title="So'nggi baholar" to="/grades" />
          {grades.loading ? (
            <div>
              {Array.from({ length: MAX_PREVIEW_ROWS }, (_, index) => (
                <Skeleton key={index} className="mt-2 h-12" />
              ))}
            </div>
          ) : grades.error ? (
            <PortalErrorState onRetry={grades.reload} />
          ) : sortedGrades.length === 0 ? (
            <EmptyState size="sm" icon={GraduationCap} title="Hozircha baho yo'q" />
          ) : (
            <div>
              {sortedGrades.slice(0, MAX_PREVIEW_ROWS).map((grade) => (
                <GradeRow
                  key={`${grade.exam_id}-${grade.group_id}`}
                  title={grade.exam_name}
                  meta={`${grade.group_name} · ${formatDate(grade.date)}`}
                  score={grade.score}
                  maxScore={grade.max_score}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card padding="p-4">
        <div className="flex flex-col gap-3">
          <SectionHeader title="To'lovlar" to="/payments" />
          {payments.loading ? (
            <div>
              {Array.from({ length: MAX_PREVIEW_ROWS }, (_, index) => (
                <Skeleton key={index} className="mt-2 h-12" />
              ))}
            </div>
          ) : payments.error ? (
            <PortalErrorState onRetry={payments.reload} />
          ) : recentPayments.length === 0 ? (
            <EmptyState size="sm" icon={Banknote} title="To'lovlar tarixi bo'sh" />
          ) : (
            <div>
              {recentPayments.map((payment) => (
                <PaymentRow
                  key={payment.id}
                  date={payment.payment_date}
                  title={formatMonth(payment.month_for)}
                  amount={payment.amount}
                  status="paid"
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card padding="p-4">
        <div className="flex flex-col gap-3">
          <SectionHeader title="So'nggi harakatlar" />
          {summary.loading ? (
            <div>
              {Array.from({ length: MAX_PREVIEW_ROWS }, (_, index) => (
                <Skeleton key={index} className="mt-2 h-12" />
              ))}
            </div>
          ) : summary.error ? (
            <PortalErrorState onRetry={summary.reload} />
          ) : recentEvents.length === 0 ? (
            <EmptyState size="sm" icon={CalendarCheck} title="Hozircha harakat yo'q" />
          ) : (
            <div>
              {recentEvents.map((event, index) => (
                <EventRow
                  key={`${event.type}-${event.date}-${index}`}
                  icon={event.type === "payment" ? Banknote : CalendarCheck}
                  tone={event.type === "payment" ? "accent" : "neutral"}
                  title={event.label}
                  meta={formatDate(event.date)}
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
