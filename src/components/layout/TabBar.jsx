import { NavLink } from "react-router-dom";
import { CalendarCheck, GraduationCap, Home, MessageCircle } from "lucide-react";
import { cn } from "../../utils/cn";

// Four destinations, floating clear of the content. Everything else lives in
// the drawer — a fifth tab would make none of them findable.
const TABS = [
  { to: "/", label: "Asosiy", icon: Home, end: true },
  { to: "/grades", label: "Baholash", icon: GraduationCap },
  { to: "/attendance", label: "Davomat", icon: CalendarCheck },
  { to: "/chat", label: "Chatlar", icon: MessageCircle, badge: true },
];

export default function TabBar({ unreadChats = 0 }) {
  return (
    <nav className="fixed inset-x-[13px] bottom-[13px] z-30 mx-auto flex max-w-lg items-center justify-around rounded-[22px] border border-white/[.09] bg-surface/[.92] px-1.5 py-[9px] shadow-tabbar backdrop-blur-xl">
      {TABS.map(({ to, label, icon: Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "relative flex flex-col items-center gap-[3px] transition-colors",
              isActive ? "text-carrot-bright" : "text-ink-faint",
            )
          }
        >
          {({ isActive }) => (
            <>
              {badge && unreadChats > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-px right-[3px] h-1.5 w-1.5 rounded-full bg-rose shadow-glow-rose"
                />
              )}
              <span
                className={cn(
                  "grid h-[30px] w-[30px] place-items-center rounded-[12px] transition-colors",
                  isActive && "bg-carrot-grad text-[#2A1206] shadow-glow",
                )}
              >
                <Icon size={15} strokeWidth={isActive ? 2.3 : 2.1} />
              </span>
              <span className="text-[8.5px] font-bold">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
