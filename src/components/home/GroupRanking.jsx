import { useState } from "react";
import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SectionHeader from "../ui/SectionHeader";
import { Trophy } from "lucide-react";
import { cn } from "../../utils/cn";

// Top three, then the child's own row pulled out and lit. With two groups the
// parent can see where their child is strong and where they are not.
const MEDAL = {
  1: "bg-[linear-gradient(150deg,#F7D46A,#D9A227)] text-[#3A2600]",
  2: "bg-[linear-gradient(150deg,#DCDCE4,#A9A9B8)] text-[#2C2C35]",
  3: "bg-[linear-gradient(150deg,#E2A170,#B26A38)] text-[#33190A]",
};

function Row({ position, name, score, me }) {
  return (
    <div
      className={cn(
        "flex items-center gap-[9px] rounded-[12px] border px-[9px] py-[7px]",
        me ? "border-carrot/[.34] bg-carrot/[.13] shadow-[0_0_18px_-8px_rgba(236,138,69,.55)]" : "border-transparent bg-black/[.22]",
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 flex-none place-items-center rounded-[7px] text-[9.5px] font-extrabold",
          MEDAL[position] || (me ? "bg-carrot/[.22] text-carrot-bright" : "bg-white/[.06] text-ink-faint"),
        )}
      >
        {position}
      </span>
      <Avatar size="sm" />
      <span className={cn("min-w-0 flex-1 truncate text-[10.5px] font-bold", me ? "text-carrot-bright" : "text-ink")}>
        {name}
      </span>
      <span className="flex-none font-display text-[12px] font-bold tracking-tight text-ink tnum">
        {score}
        <small className="text-[8.5px] font-semibold text-ink-faint">%</small>
      </span>
    </div>
  );
}

export default function GroupRanking({ groups = [] }) {
  const [index, setIndex] = useState(0);
  const group = groups[index];

  if (groups.length === 0) {
    return (
      <Card>
        <SectionHeader title="Guruh reytingi" />
        <EmptyState icon={Trophy} text="Reyting uchun hali baho yetarli emas" />
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader
        title="Guruh reytingi"
        aside={groups.length > 1 ? `${groups.length} guruh` : null}
      />

      {groups.length > 1 && (
        <div className="mt-2.5 flex gap-1.5">
          {groups.map((item, itemIndex) => (
            <button
              key={item.group_id}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={cn(
                "flex-1 rounded-[9px] border px-1 py-1.5 text-[9px] font-bold transition-colors",
                itemIndex === index
                  ? "border-carrot/30 bg-carrot/[.14] text-carrot-bright"
                  : "border-transparent bg-black/[.24] text-ink-faint",
              )}
            >
              {item.group_name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex flex-col gap-1.5">
        {group.top.map((student) => (
          <Row
            key={student.student_id}
            position={student.position}
            name={student.full_name}
            score={student.score}
          />
        ))}
        {/* The child's own row is always shown, even when already in the top
            three — the parent should never have to hunt for it. */}
        <Row position={group.me.position} name="Sizning farzandingiz" score={group.me.score} me />
      </div>

      {group.footnote && (
        <p className="mt-[9px] border-t border-line pt-[9px] text-[9px] font-semibold text-ink-faint">
          {group.footnote}
        </p>
      )}
    </Card>
  );
}
