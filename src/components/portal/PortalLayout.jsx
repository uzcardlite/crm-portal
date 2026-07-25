import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UserX } from "lucide-react";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import PortalAppBar from "./PortalAppBar";
import PortalErrorState from "./PortalErrorState";
import PortalTabBar from "./PortalTabBar";
import { getPortalChatThreads } from "../../api/portal";
import { usePortalAuth } from "../../context/PortalAuthContext";

export default function PortalLayout() {
  const { students, activeStudentId, loading, error, reloadStudents, logout } =
    usePortalAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Total unread teacher-chat messages, shown as an amber dot on the corner
  // chat button. Fetched silently (no error toast — it is a background badge)
  // and refreshed on every navigation so it clears after the chat is read.
  useEffect(() => {
    if (!activeStudentId) {
      setUnreadCount(0);
      return undefined;
    }
    let cancelled = false;
    getPortalChatThreads(activeStudentId)
      .then((rows) => {
        if (cancelled) return;
        const total = (Array.isArray(rows) ? rows : []).reduce(
          (sum, thread) => sum + (thread.unread_count || 0),
          0,
        );
        setUnreadCount(total);
      })
      .catch(() => {
        if (!cancelled) setUnreadCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [activeStudentId, location.pathname]);

  // The children list failed or is empty -> the tabs would all render the same
  // dead end, so one explicit screen replaces the page content.
  let content = <Outlet />;
  if (!loading && error) {
    content = (
      <PortalErrorState
        size="md"
        title="Ma'lumotni yuklab bo'lmadi"
        description="Farzandlaringiz ro'yxatini olishda xatolik yuz berdi."
        onRetry={reloadStudents}
      />
    );
  } else if (!loading && students.length === 0) {
    content = (
      <div className="flex flex-col gap-4">
        <EmptyState
          icon={UserX}
          title="Faol o'quvchi topilmadi"
          description="Sizga bog'langan faol o'quvchi topilmadi, o'quv markazga murojaat qiling."
        />
        <Button variant="secondary" className="w-full" onClick={logout}>
          Chiqish
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background font-sans">
      <PortalAppBar unreadCount={unreadCount} />
      <PortalTabBar variant="top" unreadCount={unreadCount} />
      <main className="mx-auto w-full max-w-lg space-y-4 px-4 pb-24 pt-4 md:pb-8">
        {content}
      </main>
      <PortalTabBar variant="bottom" />
    </div>
  );
}
