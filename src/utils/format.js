// Canonical display formatters for the whole app. Moved verbatim from
// crm-frontend's utils/format.js — add a new formatter HERE, never a second
// copy in a page.

export const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

// Every formatter renders the SAME placeholder when there is nothing to show:
// an em dash. Never a hyphen.
export const EMPTY_VALUE = "—";

// "2026-07-14T09:00:00" -> "14.07.2026"
export function formatDate(value) {
  if (!value) return EMPTY_VALUE;
  return new Date(value).toLocaleDateString("uz-UZ");
}

// "2026-07-14T09:00:00" -> "14.07.2026, 09:00:00"
export function formatDateTime(value) {
  if (!value) return EMPTY_VALUE;
  return new Date(value).toLocaleString("uz-UZ");
}

// "2026-07-14T09:00:00" -> "09:00"
export function formatTime(value) {
  if (!value) return EMPTY_VALUE;
  return new Date(value).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

// "HH:MM" from either a bare "HH:MM:SS" clock string (backend `time` field)
// or a full ISO datetime (`created_at`, `event_time`). A datetime is shown in
// the device's local time — slicing it would print "2026-" instead of a clock.
export function formatClock(value) {
  if (!value) return EMPTY_VALUE;
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return EMPTY_VALUE;
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  return text.slice(0, 5);
}

// Group digits in threes with a dot, locale-independent: 1250000 -> "1.250.000".
export function groupThousands(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? "");
  const neg = n < 0;
  const [intPart, decPart] = Math.abs(n).toString().split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const body = decPart ? `${grouped},${decPart}` : grouped;
  return neg ? `-${body}` : body;
}

// 1250000 -> "1.250.000 so'm"
export function formatMoney(value) {
  if (value === null || value === undefined) return EMPTY_VALUE;
  return `${groupThousands(value)} so'm`;
}

// "2026-07" or "2026-07-01" -> "Iyul 2026"
export function formatMonth(value) {
  if (!value) return EMPTY_VALUE;
  const [year, month] = String(value).slice(0, 7).split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

// "2026-08-20" -> "2 kun oldin" / "Bugun" / "Kecha" / falls back to formatDate
// once it is more than a week old, since "23 kun oldin" stops being useful.
export function formatRelativeDate(value) {
  if (!value) return EMPTY_VALUE;
  const date = new Date(value);
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return "Bugun";
  if (days === 1) return "Kecha";
  if (days < 7) return `${days} kun oldin`;
  return formatDate(value);
}

// "Ali Valiyev Botirovich" -> "AV" (Avatar fallback)
export function initials(fullName) {
  if (!fullName) return "?";
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
