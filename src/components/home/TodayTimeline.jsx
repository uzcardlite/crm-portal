import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SectionHeader from "../ui/SectionHeader";
import { Clock } from "lucide-react";
import { cn } from "../../utils/cn";

// The child's day as it happens: through the gate, into the lesson, a reaction
// from the teacher, back out. This is the block that makes a parent feel they
// are watching rather than reading a report.
const NODE = {
  gate_in: "bg-teal shadow-[0_0_8px_-1px_rgba(52,201,163,.8)]",
  lesson: "bg-carrot-bright shadow-glow-sm",
  reaction: "bg-amber shadow-[0_0_8px_-1px_rgba(232,176,75,.8)]",
  gate_out: "bg-surface border-2 border-ink-faint",
};

export default function TodayTimeline({ events = [], inCentre }) {
  return (
    <Card>
      <SectionHeader
        title="Bugungi kun"
        aside={
          inCentre ? (
            <>
              <i className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_8px_1px_rgba(52,201,163,.9)]" />
              Markazda
            </>
          ) : null
        }
      />

      {events.length === 0 ? (
        <EmptyState icon={Clock} text="Bugun hali hech narsa qayd etilmagan" />
      ) : (
        <div className="mt-3 flex flex-col">
          {events.map((event, index) => (
            <div key={`${event.time}-${index}`} className="flex gap-3">
              <span className="flex w-4 flex-none flex-col items-center">
                <span className={cn("mt-[3px] h-[10px] w-[10px] flex-none rounded-full", NODE[event.kind])} />
                {index < events.length - 1 && (
                  <span className="my-0.5 min-h-[15px] w-0.5 flex-1 bg-white/[.09]" />
                )}
              </span>

              <span className={cn("min-w-0 flex-1", index < events.length - 1 ? "pb-3" : "")}>
                <b className="block text-[11.5px] font-bold text-ink">{event.title}</b>
                {event.detail && (
                  <span className="mt-0.5 block text-[10px] font-semibold text-ink-faint">
                    {event.detail}
                  </span>
                )}
              </span>

              <span className="flex-none text-[10.5px] font-extrabold text-ink-soft tnum">
                {event.time}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
