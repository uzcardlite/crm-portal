import { cn } from "../../utils/cn";

// The three layers every screen is built from (DIZAYN.md §4): the carrot grid,
// the warm bloom behind the top, then the content above both. Anything that
// scrolls goes in `children`; the tab bar is rendered by the router layout.
export default function PageShell({ children, glow = true, className }) {
  return (
    <div className={cn("relative min-h-full", className)}>
      <span aria-hidden="true" className="layer-grid" />
      {glow && <span aria-hidden="true" className="layer-glow" />}
      <div className="relative z-[5]">{children}</div>
    </div>
  );
}
