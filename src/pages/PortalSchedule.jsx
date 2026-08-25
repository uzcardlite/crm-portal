import { useCallback, useMemo } from "react";
import { CalendarX } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import { getPortalSchedule } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { cn } from "../utils/cn";

// The week as seven rows, not seven columns: a phone reads down, and a day with
// no lesson is worth one quiet line rather than an empty column.
const DAYS = [
  { key: "mon", label: "Dushanba", short: "Du" },
  { key: "tue", label: "Seshanba", short: "Se" },
  { key: "wed", label: "Chorshanba", short: "Ch" },
  { key: "thu", label: "Payshanba", short: "Pa" },
  { key: "fri", label: "Juma", short: "Ju" },
  { key: "sat", label: "Shanba", short: "Sh" },
  { key: "sun", label: "Yakshanba", short: "Ya" },
];

// Monday-first index of today, so the current day can be marked.
function todayKey() {
  return DAYS[(new Date().getDay() + 6) % 7].key;
}

export default function PortalSchedule() {
  const { activeStudentId } = usePortalAuth();
  const load = useCallback(() => getPortalSchedule(activeStudentId), [activeStudentId]);
  const schedule = usePortalResource(load, Boolean(activeStudentId));

  const byDay = useMemo(() => {
    const map = Object.fromEntries(DAYS.map((day) => [day.key, []]));
    (schedule.data ?? []).forEach((group) => {
      // `sessions` carries the per-day time; a group without it falls back to
      // its own default so an older response still lands on the right days.
      const sessions =
        group.sessions?.length > 0
          ? group.sessions
          : (group.days ?? []).map((day) => ({ day, time: group.time, duration_minutes: group.duration_minutes }));

      sessions.forEach((session) => {
        if (!map[session.day]) return;
        map[session.day].push({
          id: `${group.group_id}-${session.day}`,
          group_name: group.group_name,
          teacher_name: group.teacher_name,
          room_name: group.room_name,
          time: session.time || group.time,
          duration: session.duration_minutes || group.duration_minutes,
        });
      });
    });

    Object.values(map).forEach((rows) =>
      rows.sort((a, b) => String(a.time ?? "").localeCompare(String(b.time ?? ""))),
    );
    return map;
  }, [schedule.data]);

  const total = Object.values(byDay).reduce((sum, rows) => sum + rows.length, 0);
  const today = todayKey();

  return (
    <PageShell>
      <PageTitle title="Dars jadvali" subtitle={total > 0 ? `Haftada ${total} dars` : null} />

      <div className="flex flex-col gap-[13px] px-4 pb-[108px] pt-3.5">
        {schedule.loading ? (
          [0, 1, 2].map((index) => <Skeleton key={index} className="h-20 rounded-card" />)
        ) : schedule.error ? (
          <PortalErrorState size="md" title="Jadvalni yuklab bo'lmadi" onRetry={schedule.reload} />
        ) : total === 0 ? (
          <Card>
            <EmptyState icon={CalendarX} text="Hali dars jadvali belgilanmagan" />
          </Card>
        ) : (
          DAYS.map((day) => {
            const rows = byDay[day.key];
            const isToday = day.key === today;
            return (
              <Card
                key={day.key}
                className={cn(isToday && "border-carrot/[.32] shadow-[0_0_22px_-12px_rgba(236,138,69,.55)]")}
              >
                <div className="flex items-baseline justify-between">
                  <span className={cn("text-[11px] font-extrabold", isToday ? "text-carrot-bright" : "text-ink")}>
                    {day.label}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[.06em] text-ink-faint">
                    {isToday ? "Bugun" : rows.length > 0 ? `${rows.length} dars` : "Dam olish"}
                  </span>
                </div>

                {rows.length === 0 ? (
                  <p className="mt-2 text-[10px] font-semibold text-ink-faint">Dars yo'q</p>
                ) : (
                  <div className="mt-2">
                    {rows.map((row) => (
                      <div
                        key={row.id}
                        className="flex items-center gap-2.5 border-b border-line py-2 last:border-b-0"
                      >
                        <span className="w-[38px] flex-none">
                          <b className="block font-display text-[13px] font-bold leading-none tracking-tight text-ink tnum">
                            {row.time || "—"}
                          </b>
                          {row.duration && (
                            <span className="mt-0.5 block text-[7.5px] font-bold text-ink-faint">
                              {row.duration} daq
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <b className="block truncate text-[10.5px] font-bold text-ink">
                            {row.group_name}
                          </b>
                          <span className="mt-px block truncate text-[8.5px] font-semibold text-ink-faint">
                            {[row.teacher_name, row.room_name].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </PageShell>
  );
}
