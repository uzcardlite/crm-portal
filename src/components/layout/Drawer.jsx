import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  CreditCard,
  LogOut,
  Pencil,
  Star,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import { usePortalAuth } from "../../context/PortalAuthContext";
import { cn } from "../../utils/cn";

// Everything the four tabs could not hold — and nothing more. Each entry is
// something a parent actually goes looking for; the rest was folded into the
// screens it belongs to (see DIZAYN.md §7).
const GROUPS = [
  {
    label: "Farzandim haqida",
    items: [
      { to: "/schedule", icon: CalendarDays, title: "Dars jadvali", note: "Haftalik jadval" },
      { to: "/payments", icon: CreditCard, title: "To'lovlar", note: "Tarix va keyingi to'lov" },
      { to: "/stars", icon: Star, title: "Yulduzchalar", note: "Qayerdan yig'ilgani", soon: true },
    ],
  },
  {
    label: "Ilova",
    items: [
      { to: "/notifications", icon: Bell, title: "Bildirishnomalar", note: "So'nggi xabarlar" },
      { to: "/about", icon: Building2, title: "Markaz haqida", note: "Manzil, telefon, ish vaqti", soon: true },
    ],
  },
];

export default function Drawer({ open, onClose }) {
  const { students, activeStudentId, phone, selectStudent, logout } = usePortalAuth();

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Menyuni yopish"
        onClick={onClose}
        className="fixed inset-0 z-40 animate-fade-in bg-black/65 backdrop-blur-[2px]"
      />

      <aside className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-[340px] animate-drawer-in flex-col overflow-hidden border-r border-white/[.09] bg-surface-2 shadow-drawer">
        <span aria-hidden="true" className="layer-grid" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-20 z-0 h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(236,138,69,.32),transparent_70%)]"
        />

        {/* the parent themselves, not the child */}
        <div className="relative z-[2] flex items-center gap-[11px] px-4 pb-3.5 pt-12">
          <Avatar size="lg" glow />
          <span className="min-w-0 flex-1">
            <b className="block truncate font-display text-[14.5px] font-bold tracking-tight text-ink">
              Ota-ona
            </b>
            {phone && <span className="mt-0.5 block text-[9.5px] font-semibold text-ink-faint">{phone}</span>}
          </span>
          <Link
            to="/profile"
            aria-label="Profilni tahrirlash"
            className="grid h-[26px] w-[26px] flex-none place-items-center rounded-[9px] border border-line bg-black/[.28] text-ink-faint"
          >
            <Pencil size={12} strokeWidth={2.2} />
          </Link>
        </div>

        {students.length > 1 && (
          <div className="relative z-[2] px-4 pb-3.5">
            <span className="text-[8.5px] font-bold uppercase tracking-[.09em] text-ink-faint">
              Farzandlarim
            </span>
            <div className="mt-[9px] flex gap-[7px]">
              {students.map((student) => {
                const active = String(student.id) === activeStudentId;
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => selectStudent(String(student.id))}
                    className={cn(
                      "flex flex-1 items-center gap-[7px] rounded-[12px] border px-2 py-[7px] transition-colors",
                      active ? "border-carrot/[.34] bg-carrot/[.14]" : "border-line bg-black/[.26]",
                    )}
                  >
                    <Avatar src={student.photo_url} size="sm" />
                    <span className={cn("truncate text-[10px] font-bold", active ? "text-carrot-bright" : "text-ink-soft")}>
                      {student.full_name?.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <nav className="relative z-[2] flex-1 overflow-y-auto px-3">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-1 pb-[7px] pt-3 text-[8.5px] font-bold uppercase tracking-[.09em] text-ink-faint">
                {group.label}
              </p>
              {group.items.map(({ to, icon: Icon, title, note, soon }) => {
                const row = (
                  <>
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-btn border border-line bg-black/[.28] text-ink-soft">
                      <Icon size={15} strokeWidth={2.1} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block text-[12px] font-bold text-ink">{title}</b>
                      <span className="mt-px block truncate text-[8.5px] font-semibold text-ink-faint">
                        {note}
                      </span>
                    </span>
                    {soon ? (
                      <span className="flex-none rounded-full bg-black/30 px-2 py-0.5 text-[8px] font-bold text-ink-faint">
                        tez orada
                      </span>
                    ) : (
                      <ChevronRight size={12} strokeWidth={2.4} className="flex-none text-ink-faint" />
                    )}
                  </>
                );

                // A screen that does not exist yet is shown but not linked —
                // tapping through to a redirect would read as a broken app.
                return soon ? (
                  <div key={to} className="flex items-center gap-[11px] rounded-[13px] p-2.5 opacity-55">
                    {row}
                  </div>
                ) : (
                  <Link
                    key={to}
                    to={to}
                    onClick={onClose}
                    className="flex items-center gap-[11px] rounded-[13px] p-2.5 transition-colors hover:bg-white/[.04]"
                  >
                    {row}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="relative z-[2] border-t border-line px-4 pb-5 pt-2.5">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-[9px] text-[11.5px] font-bold text-rose"
          >
            <LogOut size={14} strokeWidth={2.2} />
            Chiqish
          </button>
          <p className="mt-2.5 text-[8.5px] font-semibold text-ink-faint">Farzandim · 1.0.0</p>
        </div>
      </aside>
    </>
  );
}
