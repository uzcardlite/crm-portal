import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

const VISIBLE_MS = 4000;
const EXIT_MS = 250;

// The moment a reaction lands, this slides down over the top bar and settles
// — the "drop-in" keyframe was already sitting in the design system waiting
// for exactly this. Auto-dismisses; a tap dismisses it early.
export default function ReactionAlert({ reaction, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!reaction) return undefined;
    setLeaving(false);
    const leaveTimer = setTimeout(() => setLeaving(true), VISIBLE_MS);
    const doneTimer = setTimeout(() => onDone?.(), VISIBLE_MS + EXIT_MS);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [reaction, onDone]);

  if (!reaction) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed inset-x-0 top-[52px] z-50 mx-auto w-full max-w-lg px-4 transition-all duration-[250ms] ease-in",
        leaving ? "-translate-y-3 opacity-0" : "animate-drop-in",
      )}
    >
      <button
        type="button"
        onClick={() => setLeaving(true)}
        className="flex w-full items-start gap-[10px] rounded-card border border-line bg-surface-2 px-[13px] py-[11px] text-left shadow-tabbar"
      >
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[linear-gradient(150deg,#4CE0B4,#22B98C)] text-[16px] shadow-glow-teal">
          {reaction.emoji}
        </span>
        <span className="min-w-0 flex-1 pt-0.5">
          <b className="block text-[11.5px] font-bold leading-snug text-ink">
            {reaction.teacher_name ? `${reaction.teacher_name} reaksiya bosdi` : "Ustoz reaksiya bosdi"}
          </b>
          {reaction.note && (
            <span className="mt-0.5 block line-clamp-2 text-[10px] font-semibold leading-relaxed text-ink-faint">
              {reaction.note}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
