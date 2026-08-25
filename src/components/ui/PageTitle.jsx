// The name of the screen and, under it, what it is about — the group or groups
// the numbers below belong to.
export default function PageTitle({ title, subtitle }) {
  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-[23px] font-bold tracking-tight text-ink">{title}</h1>
      {subtitle && (
        <p className="mt-[3px] text-[10.5px] font-semibold text-ink-faint">{subtitle}</p>
      )}
    </div>
  );
}
