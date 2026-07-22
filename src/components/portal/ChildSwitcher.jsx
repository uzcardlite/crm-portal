import { UserX } from "lucide-react";
import Avatar from "../ui/Avatar";
import EmptyState from "../ui/EmptyState";
import Select from "../ui/Select";
import { cn } from "../../utils/cn";

// One child -> nothing to switch, render nothing.
// 2-3 -> chip row; 4+ -> a select (chips would overflow on a phone).
export default function ChildSwitcher({ children: students = [], activeId, onChange }) {
  if (students.length === 0) {
    return (
      <EmptyState
        size="sm"
        icon={UserX}
        title="Farzand biriktirilmagan"
        description="O'quv markazga murojaat qiling."
      />
    );
  }

  if (students.length === 1) return null;

  if (students.length > 3) {
    return (
      <Select
        className="w-full"
        value={activeId ?? ""}
        onChange={(event) => onChange(event.target.value)}
      >
        {students.map((student) => (
          <option key={student.id} value={String(student.id)}>
            {student.full_name}
          </option>
        ))}
      </Select>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto">
      {students.map((student) => {
        const isActive = String(student.id) === String(activeId);
        return (
          <button
            key={student.id}
            type="button"
            onClick={() => onChange(String(student.id))}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-accent bg-accent-light/40 text-accent-dark"
                : "border-gray-200 bg-white text-gray-600",
            )}
          >
            <Avatar size="sm" photoUrl={student.photo_url} name={student.full_name} />
            {student.full_name}
          </button>
        );
      })}
    </div>
  );
}
