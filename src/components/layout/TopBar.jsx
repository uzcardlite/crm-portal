import { Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { cn } from "../../utils/cn";
import ChildSwitcher from "./ChildSwitcher";

// Menu · child switcher · bell. Present on every screen so the child being
// looked at is never ambiguous.
export default function TopBar({ onMenu, unreadCount = 0 }) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 pt-[10px]">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Menyu"
        className="grid h-[31px] w-[31px] flex-none place-items-center rounded-btn border border-line bg-surface text-ink-soft transition-colors hover:text-ink"
      >
        <Menu size={14} strokeWidth={2.2} />
      </button>

      <ChildSwitcher />

      <Link
        to="/notifications"
        aria-label={
          unreadCount > 0
            ? `Bildirishnomalar, ${unreadCount} ta o'qilmagan`
            : "Bildirishnomalar"
        }
        className={cn(
          "relative grid h-[31px] w-[31px] flex-none place-items-center rounded-btn border border-line bg-surface transition-colors",
          unreadCount > 0 ? "text-carrot-bright shadow-glow" : "text-ink-soft hover:text-ink",
        )}
      >
        <Bell size={14} strokeWidth={2.2} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full border-2 border-bg bg-carrot-grad px-1 text-[9.5px] font-extrabold text-[#2A1206] shadow-glow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
}
