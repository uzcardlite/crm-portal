// A run worth naming, and the best one so far to reach for. Hidden below two
// in a row — "1 dars ketma-ket" is not an achievement.
export default function StreakCard({ current, best }) {
  if (!current || current < 2) return null;

  return (
    <div className="flex items-center gap-[11px] rounded-[15px] border border-carrot/[.26] bg-carrot/[.09] px-[13px] py-[11px]">
      <span className="flex-none text-[19px]" aria-hidden="true">🔥</span>
      <span className="flex-1">
        <b className="block text-[11.5px] font-extrabold text-ink">{current} dars ketma-ket</b>
        <span className="mt-0.5 block text-[9px] font-semibold text-ink-faint">
          Bir kun ham qoldirmadi
        </span>
      </span>
      {best > current && (
        <span className="flex-none text-right">
          <b className="block font-display text-[15px] font-bold tracking-tight text-carrot-bright tnum">
            {best}
          </b>
          <span className="block text-[8px] font-bold uppercase tracking-[.06em] text-ink-faint">
            rekord
          </span>
        </span>
      )}
    </div>
  );
}
