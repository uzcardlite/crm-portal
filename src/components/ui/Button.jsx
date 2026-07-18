import { cn } from "../../utils/cn";

const VARIANT_STYLES = {
  primary: "bg-accent text-accent-dark hover:bg-accent-light",
  secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

export default function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-btn px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
