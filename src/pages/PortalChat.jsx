import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Megaphone, Plus, Search, X } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import SectionHeader from "../components/ui/SectionHeader";
import Sheet from "../components/ui/Sheet";
import ThreadRow from "../components/chat/ThreadRow";
import PortalErrorState from "../components/portal/PortalErrorState";
import { toast } from "../components/ui/Toast";
import {
  createPortalChatThread,
  getPortalAnnouncements,
  getPortalChatTeachers,
  getPortalChatThreads,
} from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { getErrorMessage } from "../utils/apiError";
import { cn } from "../utils/cn";
import { formatDate } from "../utils/format";

const FILTERS = [
  { key: "all", label: "Barchasi" },
  { key: "teachers", label: "Ustozlar" },
  { key: "centre", label: "Markaz" },
];

// Teachers the parent writes to, and the centre's own announcements pinned
// above them — a schedule change should never be buried between two chats.
export default function PortalChat() {
  const { activeStudentId } = usePortalAuth();
  const enabled = Boolean(activeStudentId);

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [picker, setPicker] = useState(false);
  const [openingId, setOpeningId] = useState(null);

  const loadThreads = useCallback(() => getPortalChatThreads(activeStudentId), [activeStudentId]);
  const loadTeachers = useCallback(() => getPortalChatTeachers(activeStudentId), [activeStudentId]);
  const loadAnnouncements = useCallback(() => getPortalAnnouncements(), []);

  const threads = usePortalResource(loadThreads, enabled);
  const teachers = usePortalResource(loadTeachers, enabled);
  const announcements = usePortalResource(loadAnnouncements, enabled);

  // The thread row does not carry the teacher's name yet, so it is matched by
  // group; when the API starts sending it, this falls away.
  const teacherByGroup = useMemo(() => {
    const map = {};
    (teachers.data ?? []).forEach((teacher) => {
      map[teacher.group_name] = teacher.teacher_name;
    });
    return map;
  }, [teachers.data]);

  const rows = useMemo(() => {
    const all = threads.data ?? [];
    const text = query.trim().toLowerCase();
    if (!text) return all;
    return all.filter((thread) =>
      [thread.group_name, teacherByGroup[thread.group_name], thread.last_message_body]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(text)),
    );
  }, [threads.data, query, teacherByGroup]);

  const latestAnnouncement = (announcements.data ?? [])[0];
  const started = new Set((threads.data ?? []).map((thread) => thread.group_name));
  const canStart = (teachers.data ?? []).filter((teacher) => !started.has(teacher.group_name));

  function openWith(teacher) {
    setOpeningId(teacher.teacher_id);
    createPortalChatThread(activeStudentId, teacher.teacher_id)
      .then(() => {
        setPicker(false);
        threads.reload?.();
      })
      .catch((error) => toast.error(getErrorMessage(error, "Suhbatni ochib bo'lmadi")))
      .finally(() => setOpeningId(null));
  }

  return (
    <PageShell>
      <PageTitle
        title="Chatlar"
        subtitle={
          (threads.data ?? []).length > 0
            ? `${(threads.data ?? []).length} ta suhbat`
            : null
        }
      />

      <div className="flex flex-col gap-[11px] px-4 pb-[108px] pt-3.5">
        <label className="flex items-center gap-2 rounded-[13px] border border-line bg-surface px-[11px] py-[9px] text-ink-faint">
          <Search size={12} strokeWidth={2.3} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ustoz yoki xabar qidirish"
            className="w-full bg-transparent text-[11px] font-semibold text-ink outline-none placeholder:text-ink-faint"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Tozalash">
              <X size={12} strokeWidth={2.4} />
            </button>
          )}
        </label>

        <div className="flex gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                "flex-1 rounded-[9px] border px-1 py-1.5 text-[9.5px] font-bold transition-colors",
                filter === item.key
                  ? "border-carrot/30 bg-carrot/[.14] text-carrot-bright"
                  : "border-line bg-surface text-ink-faint",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {filter !== "teachers" && latestAnnouncement && (
          <Link
            to="/notifications"
            className="relative flex items-center gap-2.5 overflow-hidden rounded-[15px] border border-carrot/[.28] bg-[linear-gradient(140deg,rgba(210,113,47,.22),rgba(210,113,47,.06))] px-3 py-[11px]"
          >
            <span
              aria-hidden="true"
              className="absolute -right-10 -top-11 h-[110px] w-[110px] rounded-full bg-[radial-gradient(circle,rgba(236,138,69,.38),transparent_70%)]"
            />
            <span className="relative grid h-[34px] w-[34px] flex-none place-items-center rounded-[12px] bg-carrot/[.22] text-carrot-bright">
              <Megaphone size={15} strokeWidth={2.2} />
            </span>
            <span className="relative min-w-0 flex-1">
              <b className="block text-[11px] font-extrabold text-ink">Markaz e'lonlari</b>
              <span className="mt-0.5 block truncate text-[9.5px] font-semibold text-ink-soft">
                {latestAnnouncement.title}
              </span>
            </span>
            <span className="relative flex-none text-[8.5px] font-bold text-ink-faint">
              {formatDate(latestAnnouncement.created_at)}
            </span>
          </Link>
        )}

        {filter !== "centre" && (
          <>
            <SectionHeader
              title="Ustozlar"
              aside={
                canStart.length > 0 ? (
                  <button type="button" onClick={() => setPicker(true)} className="flex items-center gap-1">
                    <Plus size={11} strokeWidth={2.6} /> Yangi
                  </button>
                ) : null
              }
            />

            {threads.loading ? (
              <div className="flex flex-col gap-[9px]">
                {[0, 1, 2].map((index) => (
                  <Skeleton key={index} className="h-[62px] rounded-[15px]" />
                ))}
              </div>
            ) : threads.error ? (
              <PortalErrorState size="md" title="Suhbatlarni yuklab bo'lmadi" onRetry={threads.reload} />
            ) : rows.length === 0 ? (
              <Card>
                <EmptyState
                  icon={MessageCircle}
                  text={query ? "Hech narsa topilmadi" : "Ustoz bilan yozishmani boshlang"}
                />
              </Card>
            ) : (
              <div className="flex flex-col gap-[9px]">
                {rows.map((thread) => (
                  <ThreadRow
                    key={thread.id}
                    thread={thread}
                    teacherName={thread.teacher_name || teacherByGroup[thread.group_name]}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Sheet open={picker} onClose={() => setPicker(false)}>
        <SectionHeader title="Kimga yozmoqchisiz" />
        <div className="mt-2.5 flex flex-col gap-[7px]">
          {canStart.map((teacher) => (
            <button
              key={teacher.teacher_id}
              type="button"
              disabled={openingId === teacher.teacher_id}
              onClick={() => openWith(teacher)}
              className="flex items-center gap-2.5 rounded-[13px] border border-line bg-black/[.24] px-[11px] py-2.5 text-left disabled:opacity-50"
            >
              <span className="min-w-0 flex-1">
                <b className="block truncate text-[11px] font-bold text-ink">{teacher.teacher_name}</b>
                <span className="mt-px block truncate text-[8.5px] font-semibold text-ink-faint">
                  {teacher.group_name}
                </span>
              </span>
            </button>
          ))}
        </div>
      </Sheet>
    </PageShell>
  );
}
