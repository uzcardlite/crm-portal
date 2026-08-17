import KoshinStar from "../ui/KoshinStar";
import ThemeToggle from "../ui/ThemeToggle";
import PortalChatButton from "./PortalChatButton";
import PortalNotificationBell from "./PortalNotificationBell";

// Mobile-only top bar. The brand (koshin star + wordmark) sits on the left, the
// theme toggle and chat button on the right. Hidden on md+ where the top tab
// bar shows.
export default function PortalAppBar({ unreadCount = 0 }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <span className="flex items-center gap-2">
          <KoshinStar size={20} strokeWidth={6} className="text-accent" />
          <span className="text-lg font-semibold text-fg">Farzandim</span>
        </span>
        <div className="flex items-center gap-1.5">
          <PortalNotificationBell />
          <ThemeToggle />
          <PortalChatButton unreadCount={unreadCount} />
        </div>
      </div>
    </header>
  );
}
