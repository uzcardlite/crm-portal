import { DAY_KEYS } from "../constants/portal";

// Local-time ISO date ("2026-07-22"). `toISOString()` is deliberately avoided:
// it shifts to UTC and can report yesterday for a late-evening visit.
export function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

// JS getDay(): 0 = Sunday. DAY_KEYS is Monday-first, like the backend keys.
export function dayKeyFromDate(date) {
  return DAY_KEYS[(date.getDay() + 6) % 7];
}

export function parseTimeToMinutes(time) {
  if (!time) return null;
  const [hours, minutes] = String(time).split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(
    normalized % 60,
  ).padStart(2, "0")}`;
}

// "18:00" + 90 -> "18:00 – 19:30"; no start time -> explicit label.
export function lessonTimeRange(time, durationMinutes) {
  const start = parseTimeToMinutes(time);
  if (start === null) return "Vaqt belgilanmagan";
  const duration = Number(durationMinutes);
  if (!duration || Number.isNaN(duration)) return time;
  return `${minutesToTime(start)} – ${minutesToTime(start + duration)}`;
}

// Same hashing as crm-frontend's Schedule.jsx, so a group keeps its hue.
export function hueIndexForId(id, paletteSize = 7) {
  const value = String(id);
  let sum = 0;
  for (let i = 0; i < value.length; i += 1) sum += value.charCodeAt(i);
  return sum % paletteSize;
}

// Schedule arrives per group; the day filter is a client-side concern.
export function lessonsForDayKey(schedule, dayKey) {
  return (schedule ?? [])
    .filter((item) => Array.isArray(item.days) && item.days.includes(dayKey))
    .sort((a, b) => {
      const left = parseTimeToMinutes(a.time);
      const right = parseTimeToMinutes(b.time);
      if (left === null && right === null) return a.group_name.localeCompare(b.group_name);
      if (left === null) return 1;
      if (right === null) return -1;
      return left - right;
    });
}
