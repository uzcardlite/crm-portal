import { cn } from "../../utils/cn";

// Uppercase label on the left, a carrot aside on the right. The aside is the
// count or the way into the full list — never decoration.
export default function SectionHeader({ title, aside, className }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-2", className)}>
      <span className="text-[10px] font-bold uppercase tracking-[.08em] text-ink-faint">
        {title}
      </span>
      {aside && (
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-carrot-bright">
          {aside}
        </span>
      )}
    </div>
  );
}
