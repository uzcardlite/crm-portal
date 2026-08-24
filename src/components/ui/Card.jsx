import { cn } from "../../utils/cn";

// The one surface every block sits on. A card never glows itself — exactly one
// element inside it may (DIZAYN.md §5).
//
// `padding` is the older prop, still passed by the screens that have not been
// redesigned yet; it goes away with the last one.
export default function Card({ padding, className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface",
        padding || "p-[13px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
