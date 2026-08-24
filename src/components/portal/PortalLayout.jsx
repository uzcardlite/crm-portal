import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UserX } from "lucide-react";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import PortalErrorState from "./PortalErrorState";
import Drawer from "../layout/Drawer";
import TabBar from "../layout/TabBar";
import TopBar from "../layout/TopBar";
import { getPortalChatThreads } from "../../api/portal";
import { usePortalAuth } from "../../context/PortalAuthContext";

// The frame every screen sits in: the top bar (menu · child · bell), the page
// itself, and the floating tab bar. Nothing else is global — a screen that
// needs a title renders its own.
export default function PortalLayout() {
  const { students, loading, error, activeStudentId, reloadStudents, logout } = usePortalAuth();
  const location = useLocation();
  const [unreadChats, setUnreadChats] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Unread teacher messages, shown as a dot on the Chatlar tab. Fetched
  // silently — a background badge that fails is not worth a toast — and
  // refreshed on navigation so it clears once the chat has been read.
  useEffect(() => {
    if (!activeStudentId) {
      setUnreadChats(0);
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
        setUnreadChats(total);
      })
      .catch(() => {
        if (!cancelled) setUnreadChats(0);
      });
    return () => {
      cancelled = true;
    };
  }, [activeStudentId, location.pathname]);

  // The drawer is a screen of its own; closing it on navigation keeps the back
  // button meaning "go back a page", never "close the menu I forgot was open".
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // With no children the tabs would all lead to the same dead end, so one
  // explicit screen replaces the page content.
  let content = <Outlet />;
  if (!loading && error) {
    content = (
      <div className="px-4 pt-6">
        <PortalErrorState
          size="md"
          title="Ma'lumotni yuklab bo'lmadi"
          description="Farzandlaringiz ro'yxatini olishda xatolik yuz berdi."
          onRetry={reloadStudents}
        />
      </div>
    );
  } else if (!loading && students.length === 0) {
    content = (
      <div className="flex flex-col gap-4 px-4 pt-6">
        <EmptyState icon={UserX} text="Sizga bog'langan faol o'quvchi topilmadi. O'quv markazga murojaat qiling." />
        <Button variant="secondary" className="w-full" onClick={logout}>
          Chiqish
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg font-sans text-ink">
      <div className="relative mx-auto w-full max-w-lg">
        <TopBar onMenu={() => setMenuOpen(true)} />
        <main>{content}</main>
      </div>
      <TabBar unreadChats={unreadChats} />
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
