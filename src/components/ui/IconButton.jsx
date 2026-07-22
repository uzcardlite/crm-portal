import { cn } from "../../utils/cn";

// Square icon-only action button. `aria-label` is REQUIRED — an icon alone
// has no accessible name.
const TONE_STYLES = {
  default: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
  danger: "text-gray-400 hover:bg-danger-bg hover:text-danger",
};

export default function IconButton({
  icon: Icon,
  tone = "default",
  "aria-label": ariaLabel,
  title,
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      className={cn(
        "inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-btn transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        TONE_STYLES[tone] ?? TONE_STYLES.default,
        className,
      )}
      {...props}
    >
      {Icon ? <Icon size={16} /> : children}
    </button>
  );
}
