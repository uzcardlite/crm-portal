import { Check, Star } from "lucide-react";
import Avatar from "../ui/Avatar";
import Skeleton from "../ui/Skeleton";
import { cn } from "../../utils/cn";

// A month can bring anywhere from one reaction to a couple dozen, so spots
// are computed, not fixed: evenly spaced around the ring, starting at the
// top and going clockwise. Badges shrink a little once there are enough of
// them that full size would start overlapping.
function reactionSpot(index, total) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const radius = 54;
  return {
    top: `${50 + radius * Math.sin(angle)}%`,
    left: `${50 + radius * Math.cos(angle)}%`,
  };
}

function reactionBadgeSize(total) {
  if (total > 10) return 20;
  if (total > 6) return 24;
  return 28;
}

// The first thing a parent sees: their child, and the three facts they would
// have asked for anyway — how many stars, where in the class, is the month paid.
export default function Hero({ student, stars, rank, payment, monthReactions, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center pt-2.5">
        <Skeleton className="h-[92px] w-[92px] rounded-full" />
        <Skeleton className="mt-3 h-5 w-40" />
        <Skeleton className="mt-2 h-3 w-28" />
        <Skeleton className="mt-3 h-4 w-32" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-2.5 text-center">
      <div className="relative inline-block">
        <Avatar src={student?.photo_url} alt={student?.full_name ?? ""} size="xl" glow />
        {(monthReactions ?? []).map((reaction, index, all) => {
          const size = reactionBadgeSize(all.length);
          return (
            <span
              key={reaction.id ?? index}
              title={[reaction.teacher_name, reaction.note].filter(Boolean).join(" · ")}
              style={{
                ...reactionSpot(index, all.length),
                width: size,
                height: size,
                fontSize: size > 24 ? 15 : size > 20 ? 13 : 11,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute flex items-center justify-center rounded-full border-[3px] border-surface bg-[linear-gradient(150deg,#4CE0B4,#22B98C)] shadow-glow-teal"
            >
              {reaction.emoji}
            </span>
          );
        })}
      </div>

      <h1 className="mt-[11px] font-display text-[20px] font-bold tracking-tight text-ink">
        {student?.full_name}
      </h1>
      {student?.group_name && (
        <p className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[.09em] text-ink-faint">
          {student.group_name}
        </p>
      )}

      {/* Stars are the child's own currency — they get the brand colour. */}
      <div className="mt-[11px] inline-flex items-center gap-[7px]">
        <span className="flex items-center gap-0.5">
          {[0, 1, 2].map((index) => (
            <Star key={index} size={15} className="fill-carrot-bright text-carrot-bright" />
          ))}
        </span>
        <b className="font-display text-[15px] font-bold text-carrot-bright tnum">{stars ?? 0}</b>
        <span className="text-[9.5px] font-bold uppercase tracking-[.06em] text-ink-faint">
          yulduzcha
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
        {rank && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-[11px] py-[5px] text-[9.5px] font-bold text-ink-soft">
            Sinfda <b className="text-ink">#{rank}</b>
          </span>
        )}
        {payment && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-[9.5px] font-bold",
              payment.paid
                ? "bg-[linear-gradient(150deg,#4CE0B4,#22B98C)] text-[#08211A] shadow-glow-teal"
                : "bg-rose/15 text-rose",
            )}
          >
            {payment.paid && <Check size={9} strokeWidth={3.6} />}
            {payment.label}
          </span>
        )}
      </div>
    </div>
  );
}
