import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { CalendarCheck, GraduationCap, LogOut, Repeat, UserRound, Wallet } from "lucide-react";
import { usePortalAuth } from "../context/PortalAuthContext";
import { cn } from "../utils/cn";

const NAV_ITEMS = [
  { to: "/", label: "Bosh sahifa", icon: UserRound, end: true },
  { to: "/attendance", label: "Davomat", icon: CalendarCheck },
  { to: "/payments", label: "To'lovlar", icon: Wallet },
  { to: "/grades", label: "Baholar", icon: GraduationCap },
];

export default function PortalLayout() {
  const navigate = useNavigate();
  const { activeStudent, logout } = usePortalAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate("/select-child")}
          className="flex min-w-0 items-center gap-2"
        >
          {activeStudent?.photo_url ? (
            <img
              src={activeStudent.photo_url}
              alt={activeStudent.full_name}
              className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent-light/30 text-accent-dark">
              <UserRound size={18} />
            </span>
          )}
          <span className="min-w-0 text-left">
            <span className="block truncate text-sm font-semibold text-gray-900">
              {activeStudent?.full_name || "Farzand tanlanmagan"}
            </span>
            <span className="block truncate text-xs text-gray-500">
              {activeStudent?.tenant_name}
            </span>
          </span>
          <Repeat size={14} className="flex-shrink-0 text-gray-400" />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-btn text-gray-400 hover:bg-gray-100 hover:text-danger"
          aria-label="Chiqish"
        >
          <LogOut size={18} />
        </button>
      </header>

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-gray-100 bg-white">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
                isActive ? "text-accent-dark" : "text-gray-400",
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
