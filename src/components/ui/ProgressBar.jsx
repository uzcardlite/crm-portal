import { cn } from "../../utils/cn";

const TONE_STYLES = {
  accent: "bg-accent",
  success: "bg-success",
  danger: "bg-danger",
};

// Horizontal share indicator. The track always renders (0% still reads as a
// measured value); `value == null` renders the track alone.
export default function ProgressBar({ value, tone = "accent", className }) {
  const hasValue = value !== null && value !== undefined && !Number.isNaN(Number(value));
  const clamped = hasValue ? Math.min(100, Math.max(0, Number(value))) : 0;

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-100", className)}>
      <div
        className={cn("h-full rounded-full", TONE_STYLES[tone] ?? TONE_STYLES.accent)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
