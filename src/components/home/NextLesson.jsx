// The one card that is about the future, so it carries the brand colour and
// its own bloom — everything above it is a record of what already happened.
export default function NextLesson({ lesson }) {
  if (!lesson) return null;

  return (
    <div className="relative overflow-hidden rounded-card border border-carrot/[.28] bg-[linear-gradient(140deg,rgba(210,113,47,.24),rgba(210,113,47,.06))] p-[13px]">
      <span
        aria-hidden="true"
        className="absolute -right-10 -top-12 h-[130px] w-[130px] rounded-full bg-[radial-gradient(circle,rgba(236,138,69,.4),transparent_70%)]"
      />
      <div className="relative flex items-center gap-[11px]">
        <span className="font-display text-[22px] font-bold leading-none tracking-tight text-carrot-bright tnum">
          {lesson.countdown}
        </span>
        <span className="min-w-0">
          <b className="block truncate text-[11px] font-bold text-ink">{lesson.title}</b>
          <span className="mt-0.5 block truncate text-[9px] font-semibold text-ink-faint">
            {lesson.detail}
          </span>
        </span>
      </div>
    </div>
  );
}
