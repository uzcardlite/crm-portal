import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SectionHeader from "../ui/SectionHeader";
import { Users } from "lucide-react";

// Friends are assigned by the teacher, never by the parent — so this list is
// read-only and the empty state says who fills it.
export default function Friends({ friends = [], onOpen }) {
  return (
    <Card>
      <SectionHeader title="Do'stlari" aside={friends.length > 0 ? `${friends.length} ta` : null} />

      {friends.length === 0 ? (
        <EmptyState icon={Users} text="Ustoz hali do'st biriktirmagan" />
      ) : (
        <div className="mt-[11px] flex gap-[9px]">
          {friends.slice(0, 4).map((friend) => (
            <button
              key={friend.id}
              type="button"
              onClick={() => onOpen?.(friend)}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span className="relative">
                <Avatar src={friend.photo_url} alt={friend.full_name} size="lg" />
                {friend.in_centre && (
                  <span
                    aria-label="Hozir markazda"
                    className="absolute bottom-px right-0 h-[11px] w-[11px] rounded-full border-2 border-surface bg-teal"
                  />
                )}
              </span>
              <span className="text-center text-[9px] font-bold leading-tight text-ink">
                {friend.full_name?.split(" ")[0]}
              </span>
              <span className="text-[7.5px] font-semibold text-ink-faint">{friend.group_short}</span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
