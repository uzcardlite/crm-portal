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

// 1250000 -> "1 250 000 so'm"
export function formatMoney(value) {
  if (value === null || value === undefined) return EMPTY_VALUE;
  return `${Number(value).toLocaleString("uz-UZ")} so'm`;
}

// "2026-07" or "2026-07-01" -> "Iyul 2026"
export function formatMonth(value) {
  if (!value) return EMPTY_VALUE;
  const [year, month] = String(value).slice(0, 7).split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
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
