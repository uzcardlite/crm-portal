import { cn } from "../../utils/cn";

export default function Card({
  className,
  children,
  padding = "p-5",
  hoverable = false,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-gray-100 bg-white shadow-card",
        // Interactive cards lift softly — never `hover:shadow-md`.
        hoverable && "transition-shadow hover:shadow-card-hover",
        padding,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
