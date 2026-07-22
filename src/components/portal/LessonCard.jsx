import { EMPTY_VALUE } from "../../utils/format";

// Same hue order as crm-frontend's Schedule.jsx so one group keeps one color
// across the whole product. Classes stay literal for Tailwind's scanner.
const HUE_BORDERS = [
  "bg-scheduleBlock-teal-border",
  "bg-scheduleBlock-blue-border",
  "bg-scheduleBlock-violet-border",
  "bg-scheduleBlock-rose-border",
  "bg-scheduleBlock-amber-border",
  "bg-scheduleBlock-green-border",
  "bg-scheduleBlock-pink-border",
];

// Plain div, not ui/Card: the colored rail and the tighter p-3 are specific to
// this row and `p-4` would make three of them dominate the home screen.
export default function LessonCard({ time, groupName, teacherName, roomName, colorIndex = 0 }) {
  const rail = HUE_BORDERS[colorIndex % HUE_BORDERS.length];

  return (
    <div className="flex gap-3 rounded-card border border-gray-100 bg-white p-3 shadow-card">
      <span className={`w-1 flex-shrink-0 rounded-full ${rail}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold tabular-nums text-gray-900">{time}</p>
        <p className="truncate text-sm font-medium text-gray-900">{groupName}</p>
        <p className="truncate text-xs text-gray-500">
          {teacherName || EMPTY_VALUE} · {roomName || EMPTY_VALUE}
        </p>
      </div>
    </div>
  );
}
