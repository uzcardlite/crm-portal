import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

// "Ustozga bog'lanish" entry point that replaced the old drawer's menu button.
// Sits in the top-right corner; taps navigate to the chat list. An amber dot
// signals unread messages (count is computed once in PortalLayout and passed
// down, so both the mobile and desktop headers share a single fetch).
export default function PortalChatButton({ unreadCount = 0 }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/chat")}
      aria-label={unreadCount > 0 ? `Chat, ${unreadCount} o'qilmagan xabar` : "Chat"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors active:bg-gray-100"
    >
      <MessageCircle size={22} />
      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white" />
      )}
    </button>
  );
}
