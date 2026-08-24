import { cn } from "../../utils/cn";

// A conic-gradient donut with a surface-coloured hole. The value drives the
// sweep, so a ring can never disagree with the number printed inside it.
const HUES = {
  carrot: { arc: "#EC8A45", glow: "rgba(236,138,69,.55)" },
  teal: { arc: "#34C9A3", glow: "rgba(52,201,163,.6)" },
  amber: { arc: "#E8B04B", glow: "rgba(232,176,75,.55)" },
  rose: { arc: "#F5766B", glow: "rgba(245,118,107,.6)" },
};

const SIZES = {
  lg: { outer: 92, inner: 70, value: "text-[21px]", unit: "text-[11px]" },
  md: { outer: 80, inner: 61, value: "text-[18px]", unit: "text-[10px]" },
};

export default function Ring({
  percent,
  hue = "carrot",
  size = "lg",
  value,
  unit,
  label,
  className,
}) {
  const { arc, glow } = HUES[hue] || HUES.carrot;
  const s = SIZES[size] || SIZES.lg;
  // Clamped so a stray 120% never wraps the arc back past the start.
  const sweep = Math.max(0, Math.min(100, Number(percent) || 0));

  return (
    <div
      className={cn("relative grid flex-none place-items-center rounded-full", className)}
      style={{
        width: s.outer,
        height: s.outer,
        background: `conic-gradient(from -90deg, ${arc} 0 ${sweep}%, rgba(255,255,255,.07) ${sweep}% 100%)`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 26px -6px ${glow}` }}
      />
      <div
        className="relative z-[2] flex flex-col items-center justify-center rounded-full bg-surface"
        style={{ width: s.inner, height: s.inner }}
      >
        <b className={cn("font-display font-bold leading-none tracking-tight text-ink tnum", s.value)}>
          {value}
          {unit && <small className={cn("font-semibold text-ink-faint", s.unit)}>{unit}</small>}
        </b>
        {label && (
          <span className="mt-[3px] text-[7.5px] font-bold uppercase tracking-[.08em] text-ink-faint">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
