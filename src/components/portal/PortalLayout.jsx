import { Outlet } from "react-router-dom";
import { UserX } from "lucide-react";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import PortalErrorState from "./PortalErrorState";
import PortalTabBar from "./PortalTabBar";
import { usePortalAuth } from "../../context/PortalAuthContext";

export default function PortalLayout() {
  const { students, loading, error, reloadStudents, logout } = usePortalAuth();

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
      <PortalTabBar variant="top" />
      <main className="mx-auto w-full max-w-lg space-y-4 px-4 pb-24 pt-4 md:pb-8">
        {content}
      </main>
      <PortalTabBar variant="bottom" />
    </div>
  );
}
