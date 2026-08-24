import { useEffect } from "react";
import { cn } from "../../utils/cn";

// Bottom sheet used for anything opened from a row — a friend's profile, a
// picker. Dismisses on the scrim and on Escape, so it is never a trap.
export default function Sheet({ open, onClose, children, className }) {
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
        aria-label="Yopish"
        onClick={onClose}
        className="fixed inset-0 z-40 animate-fade-in bg-black/65 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 animate-sheet-up rounded-t-[26px] border border-b-0 border-white/10 bg-surface-2 px-4 pb-6 pt-[10px] shadow-sheet",
          className,
        )}
      >
        <span aria-hidden="true" className="mx-auto mb-3 block h-1 w-[34px] rounded-full bg-white/[.18]" />
        {children}
      </div>
    </>
  );
}
