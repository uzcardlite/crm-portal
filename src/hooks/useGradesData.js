import { useCallback, useMemo } from "react";
import { getPortalDailyGrades, getPortalGrades, getPortalSchedule } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "./usePortalResource";
import { MONTH_NAMES } from "../utils/format";

// Exam marks and daily marks are two endpoints but one thing to a parent, so
// they are folded into a single list of "a mark, on a subject, on a day" and
// everything on the screen is derived from that.

export const PERIODS = [
  { key: "month", label: "Bu oy", months: 1 },
  { key: "quarter", label: "Chorak", months: 3 },
  { key: "year", label: "Yil", months: 12 },
];

const SUBJECT_HUES = ["teal", "sky", "carrot", "amber", "rose"];

function percentOf(score, maxScore) {
  const max = Number(maxScore) || 0;
  if (max <= 0) return null;
  return (Number(score) / max) * 100;
}

function monthKey(value) {
  return String(value).slice(0, 7);
}

// The first day of the window, `months` back and rounded to the 1st — a
// "quarter" means three whole months, not ninety days from today.
function windowStart(months, today) {
  const start = new Date(today.getFullYear(), today.getMonth() - (months - 1), 1);
  return start.toISOString().slice(0, 10);
}

export function useGradesData(periodKey = "month") {
  const { activeStudentId } = usePortalAuth();
  const enabled = Boolean(activeStudentId);
  const today = useMemo(() => new Date(), []);

  const loadExams = useCallback(() => getPortalGrades(activeStudentId), [activeStudentId]);
  const loadDaily = useCallback(() => getPortalDailyGrades(activeStudentId), [activeStudentId]);
  const loadSchedule = useCallback(() => getPortalSchedule(activeStudentId), [activeStudentId]);

  const exams = usePortalResource(loadExams, enabled);
  const daily = usePortalResource(loadDaily, enabled);
  const schedule = usePortalResource(loadSchedule, enabled);

  // group -> teacher, so a mark can name the person who gave it. Grades
  // themselves do not carry the teacher, the timetable does.
  const teacherOf = useMemo(() => {
    const map = {};
    (schedule.data ?? []).forEach((item) => {
      if (item.teacher_name) map[item.group_name] = item.teacher_name;
    });
    return map;
  }, [schedule.data]);

  const all = useMemo(() => {
    const rows = [];

    (exams.data ?? []).forEach((row) => {
      const percent = percentOf(row.score, row.max_score);
      if (percent === null) return;
      rows.push({
        id: `exam-${row.exam_id}`,
        subject: row.group_name,
        title: row.exam_name,
        date: String(row.date),
        percent,
        score: Number(row.score),
        max: Number(row.max_score),
      });
    });

    (daily.data ?? []).forEach((row, index) => {
      // Daily marks may carry no max; without one there is no percentage to
      // average, so the mark is shown but never counted.
      const percent = percentOf(row.score, row.max_score);
      rows.push({
        id: `daily-${row.date}-${row.group_name}-${index}`,
        subject: row.group_name,
        title: row.note || "Kundalik baho",
        date: String(row.date),
        percent,
        score: Number(row.score),
        max: row.max_score ? Number(row.max_score) : null,
      });
    });

    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }, [exams.data, daily.data]);

  const period = PERIODS.find((item) => item.key === periodKey) ?? PERIODS[0];

  const inPeriod = useMemo(() => {
    const from = windowStart(period.months, today);
    return all.filter((row) => row.date >= from);
  }, [all, period, today]);

  // The window immediately before this one, for the "+4%" comparisons.
  const previous = useMemo(() => {
    const from = windowStart(period.months * 2, today);
    const to = windowStart(period.months, today);
    return all.filter((row) => row.date >= from && row.date < to);
  }, [all, period, today]);

  function average(rows) {
    const scored = rows.filter((row) => row.percent !== null);
    if (scored.length === 0) return null;
    return scored.reduce((sum, row) => sum + row.percent, 0) / scored.length;
  }

  const mastery = average(inPeriod);
  const masteryBefore = average(previous);

  // --- subjects ------------------------------------------------------------
  const subjects = useMemo(() => {
    const byName = new Map();
    inPeriod.forEach((row) => {
      if (!byName.has(row.subject)) byName.set(row.subject, []);
      byName.get(row.subject).push(row);
    });

    const rows = [...byName.entries()].map(([subject, marks]) => {
      const now = average(marks);
      const before = average(previous.filter((row) => row.subject === subject));
      return {
        subject,
        percent: now === null ? null : Math.round(now),
        count: marks.length,
        teacher: teacherOf[subject] || null,
        delta: now === null || before === null ? null : Math.round(now - before),
      };
    });

    return rows
      .filter((row) => row.percent !== null)
      .sort((a, b) => b.percent - a.percent)
      .map((row, index) => ({ ...row, hue: SUBJECT_HUES[index % SUBJECT_HUES.length] }));
  }, [inPeriod, previous, teacherOf]);

  // --- six-month trend -----------------------------------------------------
  const trend = useMemo(() => {
    const points = [];
    for (let back = 5; back >= 0; back -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - back, 1);
      const key = date.toISOString().slice(0, 7);
      const value = average(all.filter((row) => monthKey(row.date) === key));
      points.push({
        key,
        label: MONTH_NAMES[date.getMonth()].slice(0, 3),
        value: value === null ? null : Math.round(value),
      });
    }
    return points;
  }, [all, today]);

  // --- one-sentence read ---------------------------------------------------
  const insight = useMemo(() => {
    if (subjects.length < 2) return null;
    const best = subjects[0];
    const worst = subjects[subjects.length - 1];
    if (best.subject === worst.subject) return null;
    return { best, worst };
  }, [subjects]);

  return {
    loading: exams.loading || daily.loading,
    error: exams.error && daily.error,
    period,
    mastery: mastery === null ? null : Math.round(mastery),
    masteryDelta:
      mastery === null || masteryBefore === null ? null : Math.round(mastery - masteryBefore),
    // Marks are stored out of their own max; the familiar 5-point figure is
    // just that percentage rescaled, so the two can never disagree.
    average5: mastery === null ? null : Math.round((mastery / 20) * 10) / 10,
    total: inPeriod.length,
    subjects,
    trend,
    insight,
    recent: inPeriod.slice(0, 6),
    teacherOf,
    reload: () => {
      exams.reload?.();
      daily.reload?.();
    },
  };
}
