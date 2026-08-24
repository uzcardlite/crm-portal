import { Heart, Lock } from "lucide-react";
import Avatar from "../ui/Avatar";
import Sheet from "../ui/Sheet";
import { cn } from "../../utils/cn";

// A friend's own record, so a parent can tell what sort of child their own is
// spending time with. Money and phone numbers stay out — those belong to the
// other family, and nothing here needs them.
function Stat({ label, value, unit, percent, hue }) {
  return (
    <div className="rounded-[13px] border border-line bg-black/[.24] px-[11px] py-2.5">
      <span className="text-[8px] font-bold uppercase tracking-[.07em] text-ink-faint">
        {label}
      </span>
      <div className={cn("mt-1 font-display text-[17px] font-bold leading-none tracking-tight tnum", hue)}>
        {value}
        {unit && <small className="text-[9.5px] font-semibold text-ink-faint">{unit}</small>}
      </div>
      {typeof percent === "number" && (
        <span className="mt-[7px] block h-1 overflow-hidden rounded-full bg-white/[.07]">
          <i
            className={cn("block h-full rounded-full", hue?.replace("text-", "bg-"))}
            style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
          />
        </span>
      )}
    </div>
  );
}

export default function FriendSheet({ friend, onClose }) {
  return (
    <Sheet open={Boolean(friend)} onClose={onClose}>
      {friend && (
        <>
          <div className="flex flex-col items-center text-center">
            <Avatar src={friend.photo_url} alt={friend.full_name} size="lg" glow />
            <h2 className="mt-[9px] font-display text-[16px] font-bold tracking-tight text-ink">
              {friend.full_name}
            </h2>
            <p className="mt-0.5 text-[8.5px] font-bold uppercase tracking-[.08em] text-ink-faint">
              {friend.group_name}
              {friend.rank ? ` · ${friend.rank}-o'rin` : ""}
            </p>
            {friend.since && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-carrot/[.14] px-2.5 py-1 text-[9px] font-bold text-carrot-bright">
                <Heart size={9} className="fill-current" />
                {friend.since}
              </span>
            )}
          </div>

          <div className="mt-[13px] grid grid-cols-2 gap-[7px]">
            <Stat
              label="O'zlashtirish"
              value={friend.mastery ?? 0}
              unit="%"
              percent={friend.mastery}
              hue="text-carrot-bright"
            />
            <Stat
              label="Axloq"
              value={(friend.behaviour ?? 0).toFixed(1)}
              unit="/5"
              percent={((friend.behaviour ?? 0) / 5) * 100}
              hue="text-amber"
            />
            <Stat label="Yulduzchalar" value={friend.stars ?? 0} hue="text-ink" />
            <Stat
              label="Davomat"
              value={friend.attendance ?? 0}
              unit="%"
              percent={friend.attendance}
              hue="text-teal"
            />
          </div>

          {friend.reactions?.length > 0 && (
            <div className="mt-[9px] rounded-[13px] border border-line bg-black/[.24] px-[11px] py-2.5">
              <span className="text-[8px] font-bold uppercase tracking-[.07em] text-ink-faint">
                Ustozlar reaksiyalari
              </span>
              <div className="mt-2 flex items-center gap-1.5">
                {friend.reactions.slice(0, 5).map((emoji, index) => (
                  <span
                    key={`${emoji}-${index}`}
                    className="grid h-[26px] w-[26px] place-items-center rounded-full border border-line bg-white/[.05] text-[12px]"
                  >
                    {emoji}
                  </span>
                ))}
                <span className="ml-auto text-[9.5px] font-extrabold text-ink-soft">
                  {friend.reaction_count} ta
                </span>
              </div>
            </div>
          )}

          {friend.note && (
            <div className="mt-[9px] rounded-[13px] border border-line bg-black/[.24] px-[11px] py-2.5">
              <span className="text-[8px] font-bold uppercase tracking-[.07em] text-ink-faint">
                Ustoz izohi
              </span>
              <p className="mt-1.5 text-[10px] font-semibold italic leading-relaxed text-ink">
                &ldquo;{friend.note.text}&rdquo;
              </p>
              <p className="mt-1.5 text-[8.5px] font-bold text-ink-faint">{friend.note.by}</p>
            </div>
          )}

          <p className="mt-2.5 flex items-start gap-[7px] text-[8px] font-semibold leading-snug text-ink-faint">
            <Lock size={10} className="mt-px flex-none" />
            To'lov ma'lumotlari va shaxsiy aloqa raqamlari ko'rsatilmaydi.
          </p>
        </>
      )}
    </Sheet>
  );
}
