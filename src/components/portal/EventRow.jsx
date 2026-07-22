import { cn } from "../../utils/cn";

const TONE_STYLES = {
  neutral: "bg-gray-100 text-gray-500",
  accent: "bg-accent-light/40 text-accent-dark",
};

export default function EventRow({ icon: Icon, title, meta, value, tone = "neutral" }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-50 py-3 last:border-0">
      <span
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
          TONE_STYLES[tone] ?? TONE_STYLES.neutral,
        )}
      >
        {Icon && <Icon size={16} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{title}</p>
        {meta && <p className="mt-0.5 truncate text-xs text-gray-500">{meta}</p>}
      </div>
      {value !== null && value !== undefined && (
        <span className="flex-shrink-0 text-sm font-semibold tabular-nums text-gray-900">
          {value}
        </span>
      )}
    </div>
  );
}
