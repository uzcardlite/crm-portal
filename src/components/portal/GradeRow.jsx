import ProgressBar from "../ui/ProgressBar";

// score / max_score arrive as Decimal — JSON may deliver them as strings, so
// every comparison and ratio goes through Number().
export default function GradeRow({ title, meta, score, maxScore }) {
  const scoreValue = score === null || score === undefined ? null : Number(score);
  const maxValue = maxScore === null || maxScore === undefined ? null : Number(maxScore);
  const hasScore = scoreValue !== null && !Number.isNaN(scoreValue);
  const hasMax = maxValue !== null && !Number.isNaN(maxValue) && maxValue > 0;

  return (
    <div className="flex items-center gap-3 border-b border-line py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">{title}</p>
        <p className="mt-0.5 truncate text-xs text-fg-muted">{meta}</p>
        {hasScore && hasMax && (
          <ProgressBar
            className="mt-2"
            value={Math.min(100, (scoreValue / maxValue) * 100)}
            tone="accent"
          />
        )}
      </div>
      {hasScore ? (
        <span className="flex-shrink-0 text-sm font-semibold tabular-nums text-fg">
          {scoreValue}/{hasMax ? maxValue : "—"}
        </span>
      ) : (
        <span className="flex-shrink-0 text-sm text-fg-faint">—</span>
      )}
    </div>
  );
}
