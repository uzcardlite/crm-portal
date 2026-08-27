import { cn } from "../../utils/cn";

// A carrot ring around the photo, lit from inside. Falls back to a neutral
// silhouette rather than initials — a child's face is the point, and a letter
// where a face should be reads as an error.
const SIZES = { xl: 108, lg: 48, md: 38, sm: 26, xs: 21 };

export default function Avatar({
  src,
  photoUrl,
  alt = "",
  name,
  size = "md",
  glow = false,
  className,
}) {
  // `photoUrl`/`name` are the older prop names, still used by the screens that
  // have not been redesigned yet; they go away with the last one.
  const photo = src || photoUrl;
  const label = alt || name || "";
  const px = SIZES[size] || SIZES.md;
  const pad = px >= 48 ? 3 : 2;

  return (
    <span
      className={cn(
        "relative inline-block flex-none rounded-full",
        glow && "shadow-glow-lg",
        className,
      )}
      style={{
        width: px,
        height: px,
        padding: pad,
        background: "linear-gradient(150deg, #EC8A45, rgba(210,113,47,.3))",
      }}
    >
      <span className="grid h-full w-full place-items-end overflow-hidden rounded-full bg-[linear-gradient(150deg,#3D2F24,#231A13)]">
        {photo ? (
          <img src={photo} alt={label} className="h-full w-full rounded-full object-cover" />
        ) : (
          <svg width="100%" height="76%" viewBox="0 0 100 76" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            <circle cx="50" cy="18" r="17" fill="#ECD5BE" />
            <path d="M14 78c1-24 15-38 36-38s35 14 36 38" fill="#ECD5BE" />
          </svg>
        )}
      </span>
    </span>
  );
}
