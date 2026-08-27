import Avatar from "../ui/Avatar";
import SectionHeader from "../ui/SectionHeader";

// A teacher's own words, in their own voice. Kept as a quote and never
// summarised — the sentence is the whole value.
export default function TeacherNote({ note }) {
  if (!note) return null;

  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-surface py-[13px] pl-[15px] pr-[13px]">
      <span
        aria-hidden="true"
        className="absolute inset-y-3.5 left-0 w-[3px] rounded-r bg-[linear-gradient(180deg,#EC8A45,rgba(210,113,47,.2))] shadow-glow-sm"
      />
      <SectionHeader title="Ustoz izohi" aside={note.unread ? "Yangi" : null} />
      <p className="mt-[9px] text-[12px] font-semibold italic leading-relaxed text-ink">
        &ldquo;{note.text}&rdquo;
      </p>
      <div className="mt-2.5 flex items-center gap-2">
        <Avatar src={note.teacher_photo_url} size="sm" />
        <span className="min-w-0">
          <b className="block truncate text-[9.5px] font-bold text-ink">{note.teacher_name}</b>
          {note.group_name && (
            <span className="block truncate text-[8.5px] font-semibold text-ink-faint">
              {note.group_name}
            </span>
          )}
        </span>
        <span className="ml-auto flex-none text-[8.5px] font-bold text-ink-faint">{note.when}</span>
      </div>
    </div>
  );
}
