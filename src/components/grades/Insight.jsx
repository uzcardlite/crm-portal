import { Lightbulb } from "lucide-react";

// The comparison a parent would otherwise have to make themselves, made for
// them. Only shown when there are at least two subjects to compare.
export default function Insight({ insight }) {
  if (!insight) return null;

  return (
    <div className="flex items-start gap-[9px] rounded-[15px] border border-carrot/[.26] bg-carrot/[.08] px-3 py-[11px]">
      <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-[7px] bg-carrot/[.18] text-carrot-bright">
        <Lightbulb size={12} />
      </span>
      <p className="text-[10.5px] font-semibold leading-relaxed text-ink">
        Eng kuchli fan — <b className="text-carrot-bright">{insight.best.subject} ({insight.best.percent}%)</b>.
        {" "}Eng ko'p yordam kerak bo'lgani — <b className="text-carrot-bright">{insight.worst.subject} ({insight.worst.percent}%)</b>
        {typeof insight.worst.delta === "number" && insight.worst.delta < 0
          ? `, bu davrda ${Math.abs(insight.worst.delta)}% tushdi.`
          : "."}
      </p>
    </div>
  );
}
