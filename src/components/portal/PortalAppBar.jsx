import PortalChatButton from "./PortalChatButton";

// Mobile-only top bar. The brand sits on the left, the chat button on the
// right opens the teacher chat. Hidden on md+ where the top tab bar shows.
export default function PortalAppBar({ unreadCount = 0 }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <span className="text-lg font-semibold text-gray-900">Farzandim</span>
        <PortalChatButton unreadCount={unreadCount} />
      </div>
    </header>
  );
}
