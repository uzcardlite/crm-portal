import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import { toast } from "../components/ui/Toast";
import {
  getPortalChatMessages,
  getPortalChatThreads,
  markPortalChatRead,
  sendPortalChatMessage,
} from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { getErrorMessage } from "../utils/apiError";
import { formatTime } from "../utils/format";
import { cn } from "../utils/cn";

const POLL_MS = 6000;

export default function PortalChatThread() {
  const { threadId } = useParams();
  const { activeStudentId } = usePortalAuth();

  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("Suhbat");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  // Only mark-read once we have actually seen unread teacher messages, and only
  // fire the POST once per unread batch so polling does not spam the endpoint.
  const readInFlight = useRef(false);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, []);

  const markReadIfNeeded = useCallback(
    (rows) => {
      const hasUnreadTeacher = rows.some((m) => m.sender_type === "teacher" && !m.read_at);
      if (!hasUnreadTeacher || readInFlight.current) return;
      readInFlight.current = true;
      markPortalChatRead(threadId)
        .catch(() => {})
        .finally(() => {
          readInFlight.current = false;
        });
    },
    [threadId],
  );

  // Initial load: messages + a title pulled from the thread list.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    getPortalChatMessages(threadId)
      .then((rows) => {
        if (cancelled) return;
        setMessages(rows);
        setLoading(false);
        markReadIfNeeded(rows);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    if (activeStudentId) {
      getPortalChatThreads(activeStudentId)
        .then((threads) => {
          if (cancelled) return;
          const thread = threads.find((t) => String(t.id) === String(threadId));
          if (thread) setTitle(thread.group_name || thread.student_full_name || "Suhbat");
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [threadId, activeStudentId, markReadIfNeeded]);

  // Poll for new messages while the thread is open.
  useEffect(() => {
    const id = setInterval(() => {
      getPortalChatMessages(threadId)
        .then((rows) => {
          setMessages(rows);
          markReadIfNeeded(rows);
        })
        .catch(() => {});
    }, POLL_MS);
    return () => clearInterval(id);
  }, [threadId, markReadIfNeeded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(
    (event) => {
      event.preventDefault();
      const body = draft.trim();
      if (!body || sending) return;
      setSending(true);
      sendPortalChatMessage(threadId, body)
        .then((message) => {
          setMessages((current) => [...current, message]);
          setDraft("");
        })
        .catch((requestError) => {
          toast.error(getErrorMessage(requestError));
        })
        .finally(() => setSending(false));
    },
    [draft, sending, threadId],
  );

  return (
    <div className="flex min-h-[70dvh] flex-col">
      <div className="flex items-center gap-2">
        <Link
          to="/chat"
          aria-label="Orqaga"
          className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-btn text-gray-500 transition-colors active:bg-gray-100"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="truncate text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="mt-4 flex-1">
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton
                key={index}
                className={cn("h-10 w-2/3 rounded-card", index % 2 ? "self-end" : "self-start")}
              />
            ))}
          </div>
        ) : error ? (
          <PortalErrorState onRetry={() => window.location.reload()} />
        ) : messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            Hali xabar yo'q. Birinchi bo'lib yozing.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((message) => {
              const isParent = message.sender_type === "parent";
              return (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] rounded-card px-3 py-2",
                    isParent
                      ? "self-end bg-accent text-accent-dark"
                      : "self-start bg-white text-gray-900 shadow-card",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
                  <p
                    className={cn(
                      "mt-1 text-right text-[11px]",
                      isParent ? "text-accent-dark/70" : "text-gray-400",
                    )}
                  >
                    {formatTime(message.created_at)}
                  </p>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="sticky bottom-16 mt-3 flex items-end gap-2 md:bottom-0"
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Xabar yozing..."
          rows={1}
          className="max-h-32 flex-1 resize-none rounded-btn border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          aria-label="Yuborish"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-dark transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
