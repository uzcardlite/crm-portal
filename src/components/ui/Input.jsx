import { useId } from "react";
import { cn } from "../../utils/cn";

export default function Input({ label, error, className, id, name, ...props }) {
  const fallbackId = useId();
  const inputId = id || name || fallbackId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "rounded-btn border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
          error
            ? "border-danger focus:ring-danger/30"
            : "border-gray-300 focus:border-accent",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
