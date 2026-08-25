import { useCallback, useMemo } from "react";
import { Bell, Check, GraduationCap, Megaphone, UserCheck } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { getPortalAnnouncements, getPortalSummary } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatClock, formatDate } from "../utils/format";

// What happened, newest first: the centre's announcements folded in with the
// child's own events. Teacher reactions will land here too once they exist —
// the shape of a row is already the one they need.
const ICON = {
  announcement: { Icon: Megaphone, tone: "bg-carrot/15 text-carrot-bright" },
  attendance: { Icon: UserCheck, tone: "bg-teal/15 text-teal" },
  payment: { Icon: Check, tone: "bg-teal/15 text-teal" },
  grade: { Icon: GraduationCap, tone: "bg-sky/15 text-sky" },
};

function when(value) {
  if (!value) return "";
  const date = String(value).slice(0, 10);
  const todayIso = new Date().toISOString().slice(0, 10);
  if (date === todayIso) return formatClock(value);
  const days = Math.round((new Date(todayIso) - new Date(date)) / 86400000);
  if (days === 1) return "Kecha";
  if (days < 7) return `${days} kun`;
  return formatDate(value);
}

// Everything is grouped under the day it happened, so a parent reads it the way
// they remember it rather than as one undifferentiated list.
function dayOf(value) {
  const date = String(value).slice(0, 10);
  const todayIso = new Date().toISOString().slice(0, 10);
  if (date === todayIso) return "Bugun";
  const days = Math.round((new Date(todayIso) - new Date(date)) / 86400000);
  if (days === 1) return "Kecha";
  return formatDate(value);
}

export default function PortalNotifications() {
  const { activeStudentId } = usePortalAuth();
  const enabled = Boolean(activeStudentId);

  const loadSummary = useCallback(() => getPortalSummary(activeStudentId), [activeStudentId]);
  const loadAnnouncements = useCallback(() => getPortalAnnouncements(), []);

  const summary = usePortalResource(loadSummary, enabled);
  const announcements = usePortalResource(loadAnnouncements, enabled);

  const rows = useMemo(() => {
    const items = [];

    (announcements.data ?? []).forEach((item) => {
      items.push({
        id: `ann-${item.id}`,
        kind: "announcement",
        title: item.title,
        detail: item.body,
        at: item.created_at,
      });
    });

    (summary.data?.recent_events ?? []).forEach((event, index) => {
      items.push({
        id: `event-${event.type}-${event.date}-${index}`,
        kind: ICON[event.type] ? event.type : "grade",
        title: event.label,
        detail: null,
        at: event.date,
      });
    });

    return items.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  }, [announcements.data, summary.data]);

  const loading = summary.loading || announcements.loading;

  // Consecutive rows from the same day share one heading.
  let lastDay = null;

  return (
    <PageShell>
      <PageTitle title="Bildirishnomalar" subtitle={rows.length > 0 ? `${rows.length} ta xabar` : null} />

      <div className="flex flex-col gap-[9px] px-4 pb-[108px] pt-3.5">
        {loading ? (
          [0, 1, 2, 3].map((index) => <Skeleton key={index} className="h-[58px] rounded-[15px]" />)
        ) : rows.length === 0 ? (
          <Card>
            <EmptyState icon={Bell} text="Hali bildirishnoma yo'q" />
          </Card>
        ) : (
          rows.map((row) => {
            const { Icon, tone } = ICON[row.kind] || ICON.grade;
            const day = dayOf(row.at);
            const heading = day !== lastDay ? day : null;
            lastDay = day;

            return (
              <div key={row.id} className="contents">
                {heading && (
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-[.08em] text-ink-faint">
                    {heading}
                  </span>
                )}
                <div className="flex items-start gap-[9px] rounded-[14px] border border-line bg-surface px-[11px] py-2.5">
                  <span className={`grid h-7 w-7 flex-none place-items-center rounded-full ${tone}`}>
                    <Icon size={13} strokeWidth={2.3} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block text-[10.5px] font-bold leading-snug text-ink">{row.title}</b>
                    {row.detail && (
                      <span className="mt-[3px] block line-clamp-2 text-[9px] font-semibold leading-relaxed text-ink-faint">
                        {row.detail}
                      </span>
                    )}
                  </span>
                  <span className="flex-none text-[8.5px] font-bold text-ink-faint">
                    {when(row.at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </PageShell>
  );
}
