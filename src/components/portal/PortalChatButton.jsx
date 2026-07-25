import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

// "Ustozga bog'lanish" entry point that replaced the old drawer's menu button.
// A labelled amber pill in the top-right corner — the "Ustoz" text makes it
// clear this opens a chat with the teacher. An amber dot signals unread
// messages (count is computed once in PortalLayout and passed down, so the
// mobile and desktop headers share a single fetch).
export default function PortalChatButton({ unreadCount = 0 }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/chat")}
      aria-label={
        unreadCount > 0
          ? `Ustoz bilan chat, ${unreadCount} o'qilmagan xabar`
          : "Ustoz bilan chat"
      }
      className="relative flex items-center gap-1.5 rounded-full bg-accent-light/30 py-1.5 pl-3 pr-3.5 text-accent-dark transition-colors active:bg-accent-light/60"
    >
      <MessageCircle size={18} />
      <span className="text-sm font-semibold">Ustoz</span>
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white" />
      )}
    </button>
  );
}
