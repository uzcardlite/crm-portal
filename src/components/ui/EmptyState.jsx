import Button from "./Button";
import { cn } from "../../utils/cn";

// A new student has nothing yet, so every block needs its own empty line. The
// wording never blames the reader (DIZAYN.md §10).
//
// `title`/`description`/`actionLabel` are the older shape, still used by the
// screens that have not been redesigned yet; they go away with the last one.
export default function EmptyState({
  icon: Icon,
  text,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) {
  const heading = text || title;

  return (
    <div className={cn("flex flex-col items-center gap-2 py-6 text-center", className)}>
      {Icon && (
        <span className="grid h-9 w-9 place-items-center rounded-btn border border-line bg-black/25 text-ink-faint">
          <Icon size={16} />
        </span>
      )}
      {heading && (
        <p className="max-w-[24ch] text-[10.5px] font-semibold leading-relaxed text-ink-faint">
          {heading}
        </p>
      )}
      {description && (
        <p className="max-w-[28ch] text-[10px] font-medium leading-relaxed text-ink-faint/80">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" className="mt-1" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
