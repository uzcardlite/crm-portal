import { useCallback, useMemo } from "react";
import {
  getPortalAttendance,
  getPortalBehaviour,
  getPortalGrades,
  getPortalPayments,
  getPortalSchedule,
  getPortalTurnstile,
} from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "./usePortalResource";
import { formatClock, formatMoney, MONTH_NAMES } from "../utils/format";

// Everything the home screen shows, assembled from the endpoints that already
// exist. Reactions, stars and friends have no backend yet, so they are returned
// as empty and their blocks render their own "not yet" state — the page is
// never half-drawn while we wait for that work.

const WEEKDAY_SHORT = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];

function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

// Behaviour is 5.0 minus a tenth per point a teacher deducted, floored at 0 —
// the same arithmetic the parent was told about, kept in one place.
function behaviourScore(rows) {
  const deducted = rows.reduce((sum, row) => sum + Math.max(0, -(row.points || 0)), 0);
  return Math.max(0, Math.round((5 - deducted * 0.1) * 10) / 10);
}

// How many of the most recent lessons in a row the student attended. Future
// lessons are skipped rather than breaking the run — nothing has happened yet.
function currentStreak(lessons, todayIso) {
  let streak = 0;
  for (let index = lessons.length - 1; index >= 0; index -= 1) {
    const lesson = lessons[index];
    if (lesson.date > todayIso) continue;
    if (lesson.status === "present" || lesson.status === "late") streak += 1;
    else break;
  }
  return streak;
}

export function useHomeData() {
  const { activeStudentId, activeStudent } = usePortalAuth();
  const enabled = Boolean(activeStudentId);

  const today = useMemo(() => new Date(), []);
  const todayIso = today.toISOString().slice(0, 10);

  const loadAttendance = useCallback(
    () => getPortalAttendance(activeStudentId, today.getFullYear(), today.getMonth() + 1),
    [activeStudentId, today],
  );
  const loadGrades = useCallback(() => getPortalGrades(activeStudentId), [activeStudentId]);
  const loadBehaviour = useCallback(() => getPortalBehaviour(activeStudentId), [activeStudentId]);
  const loadPayments = useCallback(() => getPortalPayments(activeStudentId), [activeStudentId]);
  const loadSchedule = useCallback(() => getPortalSchedule(activeStudentId), [activeStudentId]);
  const loadTurnstile = useCallback(() => getPortalTurnstile(activeStudentId), [activeStudentId]);

  const attendance = usePortalResource(loadAttendance, enabled);
  const grades = usePortalResource(loadGrades, enabled);
  const behaviour = usePortalResource(loadBehaviour, enabled);
  const payments = usePortalResource(loadPayments, enabled);
  const schedule = usePortalResource(loadSchedule, enabled);
  const turnstile = usePortalResource(loadTurnstile, enabled);

  // --- attendance thread ---------------------------------------------------
  const lessons = useMemo(() => attendance.data?.lessons ?? [], [attendance.data]);
  const thread = useMemo(
    () =>
      lessons.map((lesson) => {
        const date = toDate(lesson.date);
        const upcoming = lesson.date > todayIso;
        return {
          date: `${lesson.group_id}-${lesson.date}`,
          day: date.getDate(),
          label: `${date.getDate()}-${MONTH_NAMES[date.getMonth()]}`,
          status: upcoming && !lesson.status ? "upcoming" : lesson.status || "upcoming",
        };
      }),
    [lessons, todayIso],
  );

  const counted = lessons.filter((lesson) => lesson.date <= todayIso && lesson.status);
  const attended = counted.filter(
    (lesson) => lesson.status === "present" || lesson.status === "late",
  ).length;

  // --- mastery -------------------------------------------------------------
  const mastery = useMemo(() => {
    const gradeRows = grades.data ?? [];
    if (gradeRows.length === 0) return null;
    const total = gradeRows.reduce((sum, row) => {
      const max = Number(row.max_score) || 0;
      return max > 0 ? sum + (Number(row.score) / max) * 100 : sum;
    }, 0);
    return { percent: Math.round(total / gradeRows.length) };
  }, [grades.data]);

  // --- behaviour and the teacher's latest note ------------------------------
  const behaviourRows = useMemo(() => behaviour.data ?? [], [behaviour.data]);
  const latestNote = useMemo(() => {
    const withNote = behaviourRows.filter((row) => row.note);
    if (withNote.length === 0) return null;
    const row = withNote[0];
    return {
      text: row.note,
      teacher_name: row.teacher_name || "Ustoz",
      group_name: row.group_name,
      when: row.date,
    };
  }, [behaviourRows]);

  // --- today's timeline ----------------------------------------------------
  const timeline = useMemo(() => {
    const events = (turnstile.data ?? [])
      .filter((event) => String(event.event_time).slice(0, 10) === todayIso)
      .map((event) => ({
        kind: event.direction === "in" ? "gate_in" : "gate_out",
        title: event.direction === "in" ? "Markazga kirdi" : "Markazdan chiqdi",
        detail: event.device_name || "Turniket",
        time: formatClock(event.event_time),
        at: event.event_time,
      }));

    const weekday = WEEKDAY_SHORT[today.getDay()].toLowerCase();
    (schedule.data ?? []).forEach((item) => {
      const meetsToday = (item.sessions ?? []).some(
        (session) => session.day?.slice(0, 2).toLowerCase() === weekday.slice(0, 2),
      );
      if (!meetsToday || !item.time) return;
      events.push({
        kind: "lesson",
        title: `${item.group_name} boshlanadi`,
        detail: item.teacher_name || null,
        time: item.time,
        at: `${todayIso}T${item.time}`,
      });
    });

    return events.sort((a, b) => String(a.at).localeCompare(String(b.at)));
  }, [turnstile.data, schedule.data, today, todayIso]);

  // --- the next lesson still ahead today ------------------------------------
  const nextLesson = useMemo(() => {
    const now = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
    const upcoming = timeline
      .filter((event) => event.kind === "lesson" && event.time > now)
      .sort((a, b) => a.time.localeCompare(b.time))[0];
    if (!upcoming) return null;

    const [hour, minute] = upcoming.time.split(":").map(Number);
    const minutesLeft = hour * 60 + minute - (today.getHours() * 60 + today.getMinutes());
    const hours = Math.floor(minutesLeft / 60);
    return {
      countdown: hours > 0 ? `${hours}s ${minutesLeft % 60}d` : `${minutesLeft}d`,
      title: upcoming.title.replace(" boshlanadi", ""),
      detail: [upcoming.detail, upcoming.time].filter(Boolean).join(" · "),
    };
  }, [timeline, today]);

  const lastGate = (turnstile.data ?? [])[0];
  const inCentre =
    Boolean(lastGate) &&
    lastGate.direction === "in" &&
    String(lastGate.event_time).slice(0, 10) === todayIso;

  // --- payment chip --------------------------------------------------------
  const debt = payments.data?.debt;
  const payment = debt
    ? debt.has_debt
      ? { paid: false, label: `Qarz: ${formatMoney(debt.amount)}` }
      : { paid: true, label: `${MONTH_NAMES[today.getMonth()]} to'landi` }
    : null;

  const loading =
    attendance.loading || grades.loading || behaviour.loading || payments.loading;

  return {
    student: activeStudent,
    loading,
    // Not built yet — the blocks below render their own empty state.
    stars: 0,
    rank: null,
    friends: [],
    ranking: [],
    payment,
    mastery,
    behaviour: behaviourRows.length > 0 ? { score: behaviourScore(behaviourRows) } : null,
    attendance: {
      days: thread,
      present: attended,
      total: counted.length,
      streak: currentStreak(lessons, todayIso),
    },
    timeline,
    inCentre,
    nextLesson,
    teacherNote: latestNote,
    reload: () => {
      attendance.reload?.();
      grades.reload?.();
      behaviour.reload?.();
      payments.reload?.();
      turnstile.reload?.();
    },
  };
}
