import { useCallback, useEffect, useMemo, useState } from "react";
import { getPortalAttendance, getPortalTurnstile } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "./usePortalResource";
import { formatClock, MONTH_NAMES } from "../utils/format";

// The month on screen is one request; the ring above it may cover more. Both
// are driven from the same cursor so "‹ Iyul" moves the whole page back, not
// just the thread.

export const PERIODS = [
  { key: "month", label: "Bu oy", months: 1 },
  { key: "quarter", label: "Chorak", months: 3 },
  { key: "year", label: "Yil", months: 12 },
];

const CAME = ["present", "late"];
// Six columns is what the comparison chart draws, whatever the period is.
const COMPARE_MONTHS = 6;

function monthsBack(cursor, count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(cursor.year, cursor.month - 1 - index, 1);
    return { year: date.getFullYear(), month: date.getMonth() + 1 };
  });
}

function keyOf({ year, month }) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function summarise(lessons, todayIso) {
  // Only lessons that have happened AND were marked count — a lesson still
  // ahead is not an absence, and one nobody marked is missing data.
  const counted = lessons.filter((lesson) => lesson.date <= todayIso && lesson.status);
  const present = counted.filter((lesson) => lesson.status === "present").length;
  const late = counted.filter((lesson) => lesson.status === "late").length;
  const absent = counted.filter((lesson) => lesson.status === "absent").length;
  const came = present + late;
  return {
    present,
    late,
    absent,
    total: counted.length,
    came,
    percent: counted.length === 0 ? null : Math.round((came / counted.length) * 100),
  };
}

export function useAttendanceData(periodKey = "month") {
  const { activeStudentId } = usePortalAuth();
  const enabled = Boolean(activeStudentId);

  const today = useMemo(() => new Date(), []);
  const todayIso = today.toISOString().slice(0, 10);
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const period = PERIODS.find((item) => item.key === periodKey) ?? PERIODS[0];

  // Months are cached by key, so paging back and forth re-requests nothing and
  // the comparison chart shares whatever the ring already loaded.
  const [cache, setCache] = useState({});
  const [loadingMonths, setLoadingMonths] = useState(true);

  const needed = useMemo(() => {
    const forSummary = monthsBack(cursor, period.months);
    const forChart = monthsBack(cursor, COMPARE_MONTHS);
    const byKey = new Map();
    [...forSummary, ...forChart].forEach((item) => byKey.set(keyOf(item), item));
    return [...byKey.values()];
  }, [cursor, period.months]);

  useEffect(() => {
    if (!enabled) return undefined;
    const missing = needed.filter((item) => !(keyOf(item) in cache));
    if (missing.length === 0) {
      setLoadingMonths(false);
      return undefined;
    }

    let cancelled = false;
    setLoadingMonths(true);
    Promise.all(
      missing.map((item) =>
        getPortalAttendance(activeStudentId, item.year, item.month)
          .then((data) => [keyOf(item), data?.lessons ?? []])
          // One month failing must not blank the whole page; it simply has no
          // lessons until the next attempt.
          .catch(() => [keyOf(item), []]),
      ),
    ).then((entries) => {
      if (cancelled) return;
      setCache((current) => ({ ...current, ...Object.fromEntries(entries) }));
      setLoadingMonths(false);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, needed, cache, activeStudentId]);

  // Switching child throws the whole cache away — it is another person's month.
  useEffect(() => {
    setCache({});
    setLoadingMonths(true);
  }, [activeStudentId]);

  const loadTurnstile = useCallback(() => getPortalTurnstile(activeStudentId), [activeStudentId]);
  const turnstile = usePortalResource(loadTurnstile, enabled);

  // date -> { in, out } from the gate, so a lesson row can say when the child
  // actually arrived and left rather than only that they were marked present.
  const gates = useMemo(() => {
    const byDate = {};
    (turnstile.data ?? []).forEach((event) => {
      const date = String(event.event_time).slice(0, 10);
      if (!byDate[date]) byDate[date] = { in: null, out: null };
      const clock = formatClock(event.event_time);
      if (event.direction === "in") {
        // Earliest entry, latest exit — the day's outer bounds.
        if (!byDate[date].in || clock < byDate[date].in) byDate[date].in = clock;
      } else if (!byDate[date].out || clock > byDate[date].out) {
        byDate[date].out = clock;
      }
    });
    return byDate;
  }, [turnstile.data]);

  const monthLessons = useMemo(() => cache[keyOf(cursor)] ?? [], [cache, cursor]);

  const windowLessons = useMemo(
    () =>
      monthsBack(cursor, period.months).flatMap((item) => cache[keyOf(item)] ?? []),
    [cursor, period.months, cache],
  );

  const summary = useMemo(() => summarise(windowLessons, todayIso), [windowLessons, todayIso]);

  // --- streak --------------------------------------------------------------
  const streak = useMemo(() => {
    const chronological = monthsBack(cursor, COMPARE_MONTHS)
      .reverse()
      .flatMap((item) => cache[keyOf(item)] ?? [])
      .filter((lesson) => lesson.date <= todayIso && lesson.status)
      .sort((a, b) => a.date.localeCompare(b.date));

    let current = 0;
    let best = 0;
    chronological.forEach((lesson) => {
      if (CAME.includes(lesson.status)) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    });
    return { current, best };
  }, [cursor, cache, todayIso]);

  // --- thread --------------------------------------------------------------
  const thread = useMemo(
    () =>
      monthLessons.map((lesson) => ({
        date: `${lesson.group_id}-${lesson.date}`,
        day: Number(String(lesson.date).slice(8, 10)),
        label: `${Number(String(lesson.date).slice(8, 10))}-${MONTH_NAMES[cursor.month - 1]}`,
        status:
          lesson.date > todayIso && !lesson.status ? "upcoming" : lesson.status || "upcoming",
      })),
    [monthLessons, cursor.month, todayIso],
  );

  // --- lesson rows ---------------------------------------------------------
  const groups = useMemo(() => {
    const names = [...new Set(monthLessons.map((lesson) => lesson.group_name))];
    return names.map((name) => ({ key: name, label: name }));
  }, [monthLessons]);

  const rows = useMemo(
    () =>
      [...monthLessons]
        .filter((lesson) => lesson.date <= todayIso)
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((lesson) => {
          const gate = gates[lesson.date] || {};
          // "Kechikdi" alone tells a parent nothing they can weigh; the gate
          // and the lesson time together say how late.
          let lateBy = null;
          if (lesson.status === "late" && gate.in && lesson.time) {
            const [gh, gm] = gate.in.split(":").map(Number);
            const [lh, lm] = lesson.time.split(":").map(Number);
            const diff = gh * 60 + gm - (lh * 60 + lm);
            if (diff > 0) lateBy = diff;
          }
          return { ...lesson, gate, lateBy };
        }),
    [monthLessons, gates, todayIso],
  );

  // --- six-month comparison -------------------------------------------------
  const months = useMemo(
    () =>
      monthsBack(cursor, COMPARE_MONTHS)
        .reverse()
        .map((item) => {
          const stats = summarise(cache[keyOf(item)] ?? [], todayIso);
          return {
            key: keyOf(item),
            label: MONTH_NAMES[item.month - 1].slice(0, 3),
            percent: stats.percent,
            current: item.year === cursor.year && item.month === cursor.month,
          };
        }),
    [cursor, cache, todayIso],
  );

  const atCurrentMonth =
    cursor.year === today.getFullYear() && cursor.month === today.getMonth() + 1;

  return {
    loading: loadingMonths,
    cursor,
    monthLabel: `${MONTH_NAMES[cursor.month - 1]} ${cursor.year}`,
    canGoForward: !atCurrentMonth,
    goBack: () =>
      setCursor((current) => {
        const date = new Date(current.year, current.month - 2, 1);
        return { year: date.getFullYear(), month: date.getMonth() + 1 };
      }),
    goForward: () =>
      setCursor((current) => {
        const date = new Date(current.year, current.month, 1);
        return { year: date.getFullYear(), month: date.getMonth() + 1 };
      }),
    period,
    summary,
    streak,
    thread,
    rows,
    groups,
    months,
    lessonCount: monthLessons.length,
  };
}
