import { NavLink } from "react-router-dom";
import { PORTAL_TABS } from "../../constants/portal";
import { cn } from "../../utils/cn";

// variant="bottom" — mobile tab bar; variant="top" — md+ header nav.
// Touch-first on purpose: no hover styles in either variant.
export default function PortalTabBar({ variant = "bottom" }) {
  if (variant === "top") {
    return (
      <header className="sticky top-0 z-30 hidden border-b border-gray-100 bg-white md:block">
        <nav className="mx-auto flex max-w-lg items-center gap-1 px-4 py-2">
          {PORTAL_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "rounded-btn px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "bg-accent-light/40 text-accent-dark" : "text-gray-500",
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
    );
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_-4px_rgb(16_24_40/0.1)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg">
        {PORTAL_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className="flex flex-1 flex-col items-center gap-1 py-2 transition-colors"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-8 w-16 items-center justify-center rounded-full transition-colors",
                      isActive
                        ? "bg-accent-light/40 text-accent-dark"
                        : "text-gray-400",
                    )}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      isActive ? "text-accent-dark" : "text-gray-400",
                    )}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
