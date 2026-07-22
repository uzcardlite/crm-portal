import { initials } from "../../utils/format";
import { cn } from "../../utils/cn";

// Single avatar treatment for the whole app: photo when there is one,
// initials on `bg-accent-light` otherwise. There is no gray variant.
const SIZE_STYLES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
};

export default function Avatar({ photoUrl, name, size = "md", zoomOnHover = false, className }) {
  const sizeClass = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  return (
    <span
      className={cn(
        "inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-light font-semibold text-accent-dark",
        sizeClass,
        // Capped on purpose — a bigger zoom inside a table row pushes the
        // layout around instead of just magnifying the photo.
        zoomOnHover && "transition-transform hover:scale-150",
        className,
      )}
      title={name || undefined}
    >
      {photoUrl ? (
        <img src={photoUrl} alt={name || ""} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}
