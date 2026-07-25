import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Avatar from "../components/ui/Avatar";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import { getPortalChatThreads } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatDate, formatTime } from "../utils/format";

// Same-day threads show a time; older ones show the date.
function threadStamp(value) {
  if (!value) return "";
  const isToday = String(value).slice(0, 10) === new Date().toISOString().slice(0, 10);
  return isToday ? formatTime(value) : formatDate(value);
}

export default function PortalChat() {
  const { activeStudentId, activeStudent } = usePortalAuth();

  const enabled = Boolean(activeStudentId);
  const loadThreads = useCallback(() => getPortalChatThreads(activeStudentId), [activeStudentId]);
  const chat = usePortalResource(loadThreads, enabled);

  const threads = useMemo(() => chat.data ?? [], [chat.data]);

  return (
    <>
      <PortalPageHeader title="Chat" subtitle={activeStudent?.full_name} />

      {chat.loading ? (
        <Card padding="p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="mt-2 h-14" />
          ))}
        </Card>
      ) : chat.error ? (
        <PortalErrorState onRetry={chat.reload} />
      ) : threads.length === 0 ? (
        <EmptyState
          size="md"
          icon={MessageCircle}
          title="Suhbatlar yo'q"
          description="O'qituvchi suhbat boshlaganda shu yerda ko'rinadi."
        />
      ) : (
        <Card padding="p-2">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              to={`/chat/${thread.id}`}
              className="flex items-center gap-3 rounded-btn px-2 py-3 transition-colors active:bg-gray-100"
            >
              <Avatar
                size="md"
                photoUrl={thread.photo_url}
                name={thread.student_full_name}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {thread.group_name || thread.student_full_name}
                  </p>
                  <span className="flex-shrink-0 text-xs text-gray-400">
                    {threadStamp(thread.last_message_at)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-gray-500">
                    {thread.last_message_body || "Xabar yo'q"}
                  </p>
                  {thread.unread_count > 0 && (
                    <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-dark">
                      {thread.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </Card>
      )}
    </>
  );
}
