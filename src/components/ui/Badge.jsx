import { cn } from "../../utils/cn";

const VARIANT_STYLES = {
  success: "bg-success-bg text-success",
  danger: "bg-danger-bg text-danger",
  warning: "bg-accent-light/40 text-accent-dark",
  neutral: "bg-gray-100 text-gray-600",
};

export default function Badge({ variant = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
