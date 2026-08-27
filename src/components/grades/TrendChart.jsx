import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SectionHeader from "../ui/SectionHeader";
import { TrendingUp } from "lucide-react";
import { cn } from "../../utils/cn";

// Six months as one line. A single month's 87% says nothing on its own — the
// direction is the whole point, so the last point is lit and the rest is quiet.
const W = 272;
const H = 96;
const PAD_X = 8;
const TOP = 14;
const BOTTOM = 78;

export default function TrendChart({ points = [] }) {
  const scored = points.filter((point) => point.value !== null);

  if (scored.length < 2) {
    return (
      <Card>
        <SectionHeader title="O'sish grafigi" aside="6 oy" />
        <EmptyState icon={TrendingUp} text="Grafik uchun kamida ikki oylik baho kerak" />
      </Card>
    );
  }

  // The scale spans the data, not 0–100: a run of 88–94 would otherwise draw as
  // a flat line and hide exactly the movement this chart exists to show.
  const values = scored.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(6, max - min);
  const lo = Math.max(0, min - span * 0.25);
  const hi = Math.min(100, max + span * 0.25);

  const step = points.length > 1 ? (W - PAD_X * 2) / (points.length - 1) : 0;
  const coords = points.map((point, index) => ({
    ...point,
    x: PAD_X + index * step,
    y: point.value === null ? null : BOTTOM - ((point.value - lo) / (hi - lo)) * (BOTTOM - TOP),
  }));

  const drawn = coords.filter((point) => point.y !== null);
  const line = drawn.map((point) => `${point.x} ${point.y}`).join(" L ");
  const area = `M ${line} L ${drawn[drawn.length - 1].x} ${H - 8} L ${drawn[0].x} ${H - 8} Z`;
  const last = drawn[drawn.length - 1];

  return (
    <Card>
      <SectionHeader title="O'sish grafigi" aside="6 oy" />

      <div className="mt-3">
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Oxirgi olti oydagi o'rtacha baho">
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EC8A45" stopOpacity=".38" />
              <stop offset="100%" stopColor="#EC8A45" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[20, 46, 72].map((y) => (
            <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#ffffff" strokeOpacity=".05" />
          ))}

          <path d={area} fill="url(#trend-fill)" />
          <path
            d={`M ${line}`}
            fill="none"
            stroke="#EC8A45"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx={last.x} cy={last.y} r="9" fill="#EC8A45" fillOpacity=".22" />
          <circle cx={last.x} cy={last.y} r="4.2" fill="#EC8A45" />
          <circle cx={last.x} cy={last.y} r="1.8" fill="#241C16" />
        </svg>

        <div className="mt-1.5 flex">
          {points.map((point, index) => (
            <span
              key={point.key}
              className={cn(
                "flex-1 text-center text-[8px] font-bold",
                index === points.length - 1 ? "text-carrot-bright" : "text-ink-faint",
              )}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
