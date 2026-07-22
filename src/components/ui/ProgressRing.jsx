import { cn } from "../../utils/cn";

// Circular percentage indicator. `value == null` draws the track only and shows
// an em dash — used when there is no data at all (never a misleading 0%).
export default function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  children,
  className,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const hasValue = value !== null && value !== undefined && !Number.isNaN(Number(value));
  const clamped = hasValue ? Math.min(100, Math.max(0, Number(value))) : 0;
  const dash = (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative flex flex-shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          className="text-gray-100"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <circle
          className="text-accent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        {hasValue ? (
          <span className="text-sm font-semibold text-accent-dark">{children}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </span>
    </div>
  );
}
