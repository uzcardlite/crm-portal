import { cn } from "../../utils/cn";

// State badge: the colour's own hue on a 15% wash of it. `tone` is semantic —
// carrot is deliberately absent, because carrot never carries state.
const TONES = {
  teal: "bg-teal/15 text-teal",
  rose: "bg-rose/15 text-rose",
  amber: "bg-amber/15 text-amber",
  sky: "bg-sky/15 text-sky",
  neutral: "bg-black/25 text-ink-faint",
};

export default function Pill({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center gap-1.5 rounded-full px-[9px] py-1 text-[8.5px] font-extrabold",
        TONES[tone] || TONES.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}
