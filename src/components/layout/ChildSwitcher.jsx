import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import Avatar from "../ui/Avatar";
import { usePortalAuth } from "../../context/PortalAuthContext";
import { cn } from "../../utils/cn";

// Which child is being looked at, and one tap to change. With a single child
// it stops being a control and just names them — a dropdown that opens onto
// one option is a dead end.
export default function ChildSwitcher() {
  const { students, activeStudentId, activeStudent, selectStudent } = usePortalAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onClick(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!activeStudent) return null;

  const firstName = activeStudent.full_name?.split(" ")[0] ?? "";
  const many = students.length > 1;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={!many}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup={many ? "listbox" : undefined}
        aria-expanded={many ? open : undefined}
        className="flex items-center gap-[7px] rounded-full border border-line bg-surface py-1 pl-[5px] pr-[10px] disabled:cursor-default"
      >
        <Avatar src={activeStudent.photo_url} size="xs" />
        <span className="text-[11.5px] font-bold text-ink">{firstName}</span>
        {many && (
          <>
            <span className="rounded-full bg-carrot/[.16] px-[5px] py-px text-[9px] font-bold text-carrot-bright">
              {students.length}
            </span>
            <ChevronDown size={11} strokeWidth={2.6} className="text-ink-faint" />
          </>
        )}
      </button>

      {open && many && (
        <ul
          role="listbox"
          className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-[190px] -translate-x-1/2 animate-fade-in overflow-hidden rounded-card border border-white/10 bg-surface-2 p-1 shadow-drawer"
        >
          {students.map((student) => {
            const active = String(student.id) === activeStudentId;
            return (
              <li key={student.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    selectStudent(String(student.id));
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-[9px] rounded-[12px] px-2 py-2 text-left transition-colors",
                    active ? "bg-carrot/[.14]" : "hover:bg-white/[.04]",
                  )}
                >
                  <Avatar src={student.photo_url} size="sm" />
                  <span className={cn("flex-1 truncate text-[11px] font-bold", active ? "text-carrot-bright" : "text-ink-soft")}>
                    {student.full_name}
                  </span>
                  {active && <Check size={13} strokeWidth={2.6} className="flex-none text-carrot-bright" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
