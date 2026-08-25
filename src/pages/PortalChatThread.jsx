import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Send } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import Avatar from "../components/ui/Avatar";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import PortalErrorState from "../components/portal/PortalErrorState";
import { MessageCircle } from "lucide-react";
import { toast } from "../components/ui/Toast";
import {
  getPortalChatMessages,
  getPortalChatTeachers,
  getPortalChatThreads,
  markPortalChatRead,
  sendPortalChatMessage,
} from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { getErrorMessage } from "../utils/apiError";
import { cn } from "../utils/cn";
import { formatClock, formatDate } from "../utils/format";

// One conversation. Replies a parent sends most often sit above the field, so
// "bugun kelolmaydi" is one tap rather than a sentence typed at a bus stop.
const QUICK = ["Rahmat!", "Bugun kelolmaydi", "Savol bor"];

function dayLabel(value) {
  const date = String(value).slice(0, 10);
  const todayIso = new Date().toISOString().slice(0, 10);
  if (date === todayIso) return "Bugun";
  const days = Math.round((new Date(todayIso) - new Date(date)) / 86400000);
  if (days === 1) return "Kecha";
  return formatDate(value);
}

export default function PortalChatThread() {
  const { threadId } = useParams();
  const { activeStudentId } = usePortalAuth();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  const loadMessages = useCallback(() => getPortalChatMessages(threadId), [threadId]);
  const loadThreads = useCallback(() => getPortalChatThreads(activeStudentId), [activeStudentId]);
  const loadTeachers = useCallback(() => getPortalChatTeachers(activeStudentId), [activeStudentId]);

  const messages = usePortalResource(loadMessages, Boolean(threadId));
  const threads = usePortalResource(loadThreads, Boolean(activeStudentId));
  const teachers = usePortalResource(loadTeachers, Boolean(activeStudentId));

  const thread = (threads.data ?? []).find((row) => String(row.id) === String(threadId));
  const teacherName = useMemo(() => {
    if (!thread?.group_name) return null;
    return (teachers.data ?? []).find((teacher) => teacher.group_name === thread.group_name)
      ?.teacher_name;
  }, [teachers.data, thread]);

  // Opening the conversation is what marks it read — the parent has seen it.
  useEffect(() => {
    if (!threadId) return;
    markPortalChatRead(threadId).catch(() => {});
  }, [threadId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.data]);

  function send(body) {
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    sendPortalChatMessage(threadId, text)
      .then(() => {
        setDraft("");
        messages.reload?.();
      })
      .catch((error) => toast.error(getErrorMessage(error, "Xabar yuborilmadi")))
      .finally(() => setSending(false));
  }

  const rows = messages.data ?? [];

  return (
    <PageShell glow={false}>
      <div className="flex items-center gap-2.5 border-b border-line px-3.5 pb-[11px] pt-2.5">
        <Link
          to="/chat"
          aria-label="Orqaga"
          className="grid h-7 w-7 flex-none place-items-center rounded-[9px] border border-line bg-surface text-ink-soft"
        >
          <ChevronLeft size={12} strokeWidth={2.6} />
        </Link>
        <Avatar src={thread?.photo_url} size="md" />
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[12px] font-bold text-ink">
            {teacherName || thread?.group_name || "Ustoz"}
          </b>
          {teacherName && thread?.group_name && (
            <span className="mt-px block truncate text-[8.5px] font-semibold text-carrot-bright">
              {thread.group_name}
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-col gap-[9px] px-3.5 pb-[132px] pt-3.5">
        {messages.loading ? (
          <>
            <Skeleton className="h-12 w-3/4 self-start rounded-[15px]" />
            <Skeleton className="h-10 w-2/3 self-end rounded-[15px]" />
            <Skeleton className="h-14 w-4/5 self-start rounded-[15px]" />
          </>
        ) : messages.error ? (
          <PortalErrorState size="md" title="Xabarlarni yuklab bo'lmadi" onRetry={messages.reload} />
        ) : rows.length === 0 ? (
          <EmptyState icon={MessageCircle} text="Hali xabar yo'q — birinchi bo'lib yozing" />
        ) : (
          rows.map((message, index) => {
            const mine = message.sender_type === "parent";
            const previous = rows[index - 1];
            const newDay =
              !previous ||
              String(previous.created_at).slice(0, 10) !== String(message.created_at).slice(0, 10);

            return (
              <div key={message.id} className="contents">
                {newDay && (
                  <span className="self-center rounded-full border border-line bg-black/[.28] px-2.5 py-[3px] text-[8.5px] font-bold text-ink-faint">
                    {dayLabel(message.created_at)}
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[78%] rounded-[15px] px-[11px] py-[9px] text-[10.5px] font-medium leading-relaxed",
                    mine
                      ? "self-end rounded-br-[5px] bg-carrot-grad font-semibold text-[#2A1206] shadow-glow"
                      : "self-start rounded-bl-[5px] border border-line bg-surface text-ink",
                  )}
                >
                  {message.body}
                  <span className={cn("mt-1 block text-[8px] font-bold", mine ? "opacity-55" : "opacity-60")}>
                    {formatClock(message.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <span ref={endRef} />
      </div>

      <div className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-lg">
        <div className="mb-1.5 flex gap-1.5">
          {QUICK.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => send(text)}
              disabled={sending}
              className="rounded-full border border-carrot/[.28] bg-carrot/[.13] px-2.5 py-[5px] text-[9px] font-bold text-carrot-bright disabled:opacity-50"
            >
              {text}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2 rounded-[20px] border border-white/[.09] bg-surface/[.94] py-[7px] pl-3 pr-2 shadow-tabbar backdrop-blur-xl"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Xabar yozing…"
            className="min-w-0 flex-1 bg-transparent text-[10.5px] font-medium text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            aria-label="Yuborish"
            className="grid h-[30px] w-[30px] flex-none place-items-center rounded-btn bg-carrot-grad text-[#2A1206] shadow-glow disabled:opacity-40"
          >
            <Send size={14} strokeWidth={2.4} />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
