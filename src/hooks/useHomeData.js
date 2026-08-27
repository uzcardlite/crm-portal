import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getPortalAttendance,
  getPortalBehaviour,
  getPortalFriends,
  getPortalGrades,
  getPortalPayments,
  getPortalReactions,
  getPortalRanking,
  getPortalSchedule,
  getPortalStars,
  getPortalTurnstile,
} from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "./usePortalResource";
import { formatClock, formatMoney, formatRelativeDate, formatTime, MONTH_NAMES } from "../utils/format";

// Everything the home screen shows, assembled from the endpoints that exist.

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
  const loadReactions = useCallback(() => getPortalReactions(activeStudentId), [activeStudentId]);
  const loadStars = useCallback(() => getPortalStars(activeStudentId), [activeStudentId]);
  const loadFriends = useCallback(() => getPortalFriends(activeStudentId), [activeStudentId]);
  const loadRanking = useCallback(() => getPortalRanking(activeStudentId), [activeStudentId]);

  const attendance = usePortalResource(loadAttendance, enabled);
  const grades = usePortalResource(loadGrades, enabled);
  const behaviour = usePortalResource(loadBehaviour, enabled);
  const payments = usePortalResource(loadPayments, enabled);
  const schedule = usePortalResource(loadSchedule, enabled);
  const turnstile = usePortalResource(loadTurnstile, enabled);
  const reactions = usePortalResource(loadReactions, enabled);
  const stars = usePortalResource(loadStars, enabled);
  const friends = usePortalResource(loadFriends, enabled);
  const ranking = usePortalResource(loadRanking, enabled);

  // --- attendance thread (this week only, not the whole month) -------------
  const lessons = useMemo(() => attendance.data?.lessons ?? [], [attendance.data]);

  const weekStartIso = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().slice(0, 10);
  }, [today]);
  const weekEndIso = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() + 6);
    return d.toISOString().slice(0, 10);
  }, [today]);

  const weekLessons = useMemo(
    () => lessons.filter((lesson) => lesson.date >= weekStartIso && lesson.date <= weekEndIso),
    [lessons, weekStartIso, weekEndIso],
  );

  const thread = useMemo(
    () =>
      weekLessons.map((lesson) => {
        const date = toDate(lesson.date);
        const upcoming = lesson.date > todayIso;
        return {
          date: `${lesson.group_id}-${lesson.date}`,
          day: date.getDate(),
          label: `${date.getDate()}-${MONTH_NAMES[date.getMonth()]}`,
          status: upcoming && !lesson.status ? "upcoming" : lesson.status || "upcoming",
        };
      }),
    [weekLessons, todayIso],
  );

  const counted = weekLessons.filter((lesson) => lesson.date <= todayIso && lesson.status);
  const attended = counted.filter(
    (lesson) => lesson.status === "present" || lesson.status === "late",
  ).length;

  // --- mastery -------------------------------------------------------------
  const thisMonthKey = todayIso.slice(0, 7);
  const lastMonthKey = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    .toISOString()
    .slice(0, 7);

  function averagePercent(rows) {
    const scored = rows.filter((row) => Number(row.max_score) > 0);
    if (scored.length === 0) return null;
    const total = scored.reduce(
      (sum, row) => sum + (Number(row.score) / Number(row.max_score)) * 100,
      0,
    );
    return total / scored.length;
  }

  const mastery = useMemo(() => {
    const gradeRows = grades.data ?? [];
    if (gradeRows.length === 0) return null;
    const percent = averagePercent(gradeRows);
    if (percent === null) return null;

    // A same-oy vs o'tgan-oy comparison, shown only when both months actually
    // have scored marks — otherwise "+N%" would be comparing against nothing.
    const thisMonth = averagePercent(gradeRows.filter((row) => String(row.date).slice(0, 7) === thisMonthKey));
    const lastMonth = averagePercent(gradeRows.filter((row) => String(row.date).slice(0, 7) === lastMonthKey));
    let note = null;
    let tone = null;
    if (thisMonth !== null && lastMonth !== null) {
      const delta = Math.round(thisMonth - lastMonth);
      if (delta !== 0) {
        tone = delta > 0 ? "up" : "down";
        note = `${delta > 0 ? "↑" : "↓"} o'tgan oydan ${delta > 0 ? "+" : ""}${delta}%`;
      }
    }

    return { percent: Math.round(percent), note, tone };
  }, [grades.data, thisMonthKey, lastMonthKey]);

  // --- behaviour and the teacher's latest note ------------------------------
  const behaviourRows = useMemo(() => behaviour.data ?? [], [behaviour.data]);
  const behaviour5 = useMemo(() => {
    // No deduction rows at all still means something: a clean record, not
    // "no data" — behaviourScore([]) already resolves that to a full 5.0.
    const score = behaviourScore(behaviourRows);
    // What the score would still be without this month's deductions — the
    // difference is exactly what "bu oy −0.3" is telling the parent.
    const before = behaviourScore(
      behaviourRows.filter((row) => String(row.date).slice(0, 7) !== thisMonthKey),
    );
    const delta = Math.round((score - before) * 10) / 10;
    return {
      score,
      note: delta !== 0 ? `bu oy ${delta > 0 ? "+" : ""}${delta.toFixed(1)}` : null,
      tone: delta > 0 ? "up" : delta < 0 ? "down" : null,
    };
  }, [behaviourRows, thisMonthKey]);
  const latestNote = useMemo(() => {
    const withNote = behaviourRows.filter((row) => row.note);
    if (withNote.length === 0) return null;
    const row = withNote[0];
    return {
      text: row.note,
      teacher_name: row.teacher_name || "Ustoz",
      group_name: row.group_name,
      when: formatRelativeDate(row.date),
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
        time: formatTime(event.event_time),
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

    (reactions.data ?? [])
      .filter((row) => String(row.created_at).slice(0, 10) === todayIso)
      .forEach((row) => {
        events.push({
          kind: "reaction",
          title: `${row.emoji} Ustoz reaksiya bosdi`,
          detail: row.note || `${row.teacher_name} · +${row.points} yulduzcha`,
          time: formatTime(row.created_at),
          at: row.created_at,
        });
      });

    return events.sort((a, b) => String(a.at).localeCompare(String(b.at)));
  }, [turnstile.data, schedule.data, reactions.data, today, todayIso]);

  // --- this month's reaction badges (scattered around the avatar) ----------
  // Resets on the 1st: only rows dated within the current calendar month
  // count, so the avatar clears out for a new month instead of piling up
  // forever. reaction_crud.get_for_student already orders newest-first.
  const monthReactions = useMemo(
    () =>
      (reactions.data ?? [])
        .filter((row) => String(row.created_at).slice(0, 7) === thisMonthKey)
        .map((row) => ({
          id: row.id,
          emoji: row.emoji,
          teacher_name: row.teacher_name,
          points: row.points,
          note: row.note,
          created_at: row.created_at,
        })),
    [reactions.data, thisMonthKey],
  );

  // --- live "a reaction just landed" banner ---------------------------------
  // Reactions aren't pushed, so we poll gently and diff against what this tab
  // has already shown — the first load seeds the seen-set silently (nothing
  // from before opening the app should announce itself), only a row that
  // shows up afterwards triggers the banner.
  const [alertReaction, setAlertReaction] = useState(null);
  const seenReactionIds = useRef(null);

  // A different child means a different reaction history — reseed silently
  // instead of comparing against the previous child's ids.
  useEffect(() => {
    seenReactionIds.current = null;
    setAlertReaction(null);
  }, [activeStudentId]);

  useEffect(() => {
    if (reactions.data == null) return;
    const rows = reactions.data;
    if (seenReactionIds.current === null) {
      seenReactionIds.current = new Set(rows.map((row) => row.id));
      return;
    }
    const fresh = rows.find((row) => !seenReactionIds.current.has(row.id));
    rows.forEach((row) => seenReactionIds.current.add(row.id));
    if (fresh) {
      setAlertReaction({
        id: fresh.id,
        emoji: fresh.emoji,
        teacher_name: fresh.teacher_name,
        note: fresh.note,
      });
    }
  }, [reactions.data]);

  useEffect(() => {
    if (!enabled) return undefined;
    const timer = setInterval(() => reactions.reload(), 20000);
    function onVisible() {
      if (document.visibilityState === "visible") reactions.reload();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, activeStudentId]);

  const dismissAlert = useCallback(() => setAlertReaction(null), []);

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

  // --- friends (teacher-assigned, with the same numbers their own home
  // screen would show — a parent judging a friendship needs more than a name) ---
  const friendList = useMemo(
    () =>
      (friends.data ?? []).map((friend) => ({
        id: friend.student_id,
        photo_url: friend.photo_url,
        full_name: friend.full_name,
        group_name: friend.group_name,
        group_short: friend.group_name,
        in_centre: false, // not computed per-friend yet — omitted rather than guessed
        mastery: friend.mastery_percent,
        behaviour: friend.behaviour_score,
        stars: friend.stars,
        attendance: friend.attendance_percent,
      })),
    [friends.data],
  );

  // --- group ranking ---------------------------------------------------------
  const rankingGroups = useMemo(
    () =>
      (ranking.data ?? []).map((group) => {
        const better = group.top.find((row) => row.position === group.me.position - 1);
        let footnote = `${group.total_students} o'quvchidan ${group.me.position}-o'rin`;
        if (better) {
          footnote += ` · ${better.position}-o'ringacha ${better.score - group.me.score}% qoldi`;
        } else if (group.me.position === 1) {
          footnote += " · guruhda birinchi!";
        }
        return { ...group, footnote };
      }),
    [ranking.data],
  );

  const loading =
    attendance.loading || grades.loading || behaviour.loading || payments.loading;

  return {
    student: activeStudent,
    loading,
    stars: stars.data?.total ?? 0,
    rank: stars.data?.rank ?? null,
    friends: friendList,
    ranking: rankingGroups,
    payment,
    mastery,
    behaviour: behaviour5,
    attendance: {
      days: thread,
      present: attended,
      total: counted.length,
      streak: currentStreak(lessons, todayIso),
    },
    timeline,
    monthReactions,
    alertReaction,
    dismissAlert,
    inCentre,
    nextLesson,
    teacherNote: latestNote,
    reload: () => {
      attendance.reload?.();
      grades.reload?.();
      behaviour.reload?.();
      payments.reload?.();
      turnstile.reload?.();
      reactions.reload?.();
      stars.reload?.();
      friends.reload?.();
      ranking.reload?.();
    },
  };
}
