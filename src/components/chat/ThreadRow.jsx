import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import { cn } from "../../utils/cn";
import { formatClock, formatDate } from "../../utils/format";

// A row names the teacher and, under them, the subject — a parent should never
// have to work out who "Aziz aka" is. Until the API carries the name, the
// group stands in for it.
function when(value) {
  if (!value) return "";
  const date = String(value).slice(0, 10);
  const todayIso = new Date().toISOString().slice(0, 10);
  if (date === todayIso) return formatClock(value);
  const days = Math.round((new Date(todayIso) - new Date(date)) / 86400000);
  if (days === 1) return "Kecha";
  if (days < 7) return `${days} kun`;
  return formatDate(value);
}

export default function ThreadRow({ thread, teacherName }) {
  const title = teacherName || thread.group_name || "Ustoz";
  const subtitle = teacherName ? thread.group_name : null;
  const unread = thread.unread_count > 0;

  return (
    <Link
      to={`/chat/${thread.id}`}
      className={cn(
        "flex items-center gap-2.5 rounded-[15px] border px-[11px] py-2.5 transition-colors",
        unread ? "border-carrot/30 bg-surface-2" : "border-line bg-surface",
      )}
    >
      <Avatar src={thread.photo_url} alt={title} size="md" />

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-1.5">
          <b className="truncate text-[11.5px] font-bold text-ink">{title}</b>
          <span className="flex-none text-[8.5px] font-bold text-ink-faint">
            {when(thread.last_message_at)}
          </span>
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[8.5px] font-bold text-carrot-bright">
            {subtitle}
          </span>
        )}
        <span className="mt-[3px] block truncate text-[10px] font-medium text-ink-soft">
          {thread.last_message_body || "Yozishmani boshlang"}
        </span>
      </span>

      {unread && (
        <span className="grid h-[18px] min-w-[18px] flex-none place-items-center rounded-full bg-carrot-grad px-[5px] text-[9.5px] font-extrabold text-[#2A1206] shadow-glow">
          {thread.unread_count > 9 ? "9+" : thread.unread_count}
        </span>
      )}
    </Link>
  );
}
