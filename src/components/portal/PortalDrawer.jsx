import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import Avatar from "../ui/Avatar";
import { usePortalAuth } from "../../context/PortalAuthContext";
import { PORTAL_MENU } from "../../constants/portal";
import { cn } from "../../utils/cn";

// Slide-in navigation menu. Repeats the bottom tabs and adds the entries that
// have no tab (Dars jadvali), plus the account actions (Chiqish). Opened from
// the top app bar's menu button; closed by the backdrop, the X, a nav tap,
// Escape, or the Android hardware back button.
export default function PortalDrawer({ open, onClose }) {
  const { activeStudent, logout } = usePortalAuth();
  const location = useLocation();

  // Lock the page behind the drawer so only the panel scrolls.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes on web.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Push a throwaway history entry while open so the Android back button (and
  // the browser back button) closes the drawer instead of leaving the page.
  useEffect(() => {
    if (!open) return undefined;
    window.history.pushState({ portalDrawer: true }, "");
    const onPopState = () => onClose();
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      // Closed via the UI (not back): drop the sentinel we pushed.
      if (window.history.state?.portalDrawer) {
        window.history.back();
      }
    };
  }, [open, onClose]);

  // A nav tap navigates; make sure the drawer follows the route away.
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Menyuni yopish"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-gray-900/40"
      />

      <aside
        className="absolute inset-y-0 right-0 flex w-[82%] max-w-xs animate-slide-in-right flex-col bg-background shadow-drawer"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Account header — soft accent gradient with the active child. */}
        <div className="relative bg-gradient-to-br from-accent to-accent-light px-5 pb-5 pt-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-accent-dark/80 transition-colors hover:bg-white/30"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <Avatar
              size="lg"
              photoUrl={activeStudent?.photo_url}
              name={activeStudent?.full_name}
              className="ring-2 ring-white/60"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-accent-dark">
                {activeStudent?.full_name ?? "Farzandim"}
              </p>
              <p className="truncate text-sm text-accent-dark/70">
                {activeStudent?.tenant_name ?? ""}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {PORTAL_MENU.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent-light/40 text-accent-dark"
                          : "text-gray-600 active:bg-gray-100",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={20}
                          className={isActive ? "text-accent-dark" : "text-gray-400"}
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Account actions + version */}
        <div className="border-t border-gray-100 px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium text-danger transition-colors active:bg-danger-bg"
          >
            <LogOut size={20} />
            Chiqish
          </button>
          <p className="mt-3 px-3 text-center text-xs text-gray-400">Farzandim</p>
        </div>
      </aside>
    </div>
  );
}
