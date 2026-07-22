// Portal (ota-ona/o'quvchi kabineti) konstantalari.
import { Banknote, CalendarCheck, GraduationCap, Home, User } from "lucide-react";

// Backend weekday keys, Monday-first (matches crm-frontend's Groups/Schedule order).
export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const DAY_LABELS = {
  mon: "Du",
  tue: "Se",
  wed: "Chor",
  thu: "Pay",
  fri: "Ju",
  sat: "Sha",
  sun: "Yak",
};

// Two-letter header for the month calendar grid (7 narrow columns).
export const WEEKDAY_HEADER = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

export const ATTENDANCE_CELL = {
  present: { label: "Keldi", className: "bg-success-bg text-success" },
  absent: { label: "Kelmadi", className: "bg-danger-bg text-danger" },
  // Same pixels as Badge variant="warning" — no new token needed.
  late: { label: "Kechikdi", className: "bg-accent-light/40 text-accent-dark" },
};

export const ATTENDANCE_STATUS_CLASS = Object.fromEntries(
  Object.entries(ATTENDANCE_CELL).map(([status, cell]) => [status, cell.className]),
);

export const ATTENDANCE_LABELS = Object.fromEntries(
  Object.entries(ATTENDANCE_CELL).map(([status, cell]) => [status, cell.label]),
);

// Kalit yo'q (dars bo'lmagan / belgilanmagan kun): fon YO'Q, faqat matn rangi.
export const ATTENDANCE_EMPTY_CLASS = "text-gray-300";

// Bugungi kun katagiga qo'shiladi (status klassi ustiga).
export const TODAY_RING_CLASS = "ring-1 ring-accent";

// This app IS the portal — no "/portal" route prefix.
// Schedule is reachable from the home page ("Barchasi >"), not from the tab bar.
export const PORTAL_TABS = [
  { to: "/", label: "Asosiy", icon: Home, end: true },
  { to: "/attendance", label: "Davomat", icon: CalendarCheck },
  { to: "/grades", label: "Baholar", icon: GraduationCap },
  { to: "/payments", label: "To'lovlar", icon: Banknote },
  { to: "/profile", label: "Profil", icon: User },
];
