// Portal (ota-ona/o'quvchi kabineti) konstantalari.
import {
  Banknote,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Home,
  Megaphone,
  Smile,
  User,
} from "lucide-react";

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

// Solid, saturated fills with white text — deep green / deep red / deep amber.
// Reads well in BOTH light and dark (the old *-bg pastels looked washed out on
// the dark calendar). Same className drives the day cell and the legend dot.
export const ATTENDANCE_CELL = {
  present: { label: "Keldi", className: "bg-success text-white" },
  absent: { label: "Kelmadi", className: "bg-danger text-white" },
  late: { label: "Kechikdi", className: "bg-accent-dark text-white" },
};

export const ATTENDANCE_STATUS_CLASS = Object.fromEntries(
  Object.entries(ATTENDANCE_CELL).map(([status, cell]) => [status, cell.className]),
);

export const ATTENDANCE_LABELS = Object.fromEntries(
  Object.entries(ATTENDANCE_CELL).map(([status, cell]) => [status, cell.label]),
);

// This app IS the portal — no "/portal" route prefix.
// Schedule is reachable from the home page ("Barchasi >"), not from the tab bar.
export const PORTAL_TABS = [
  { to: "/", label: "Asosiy", icon: Home, end: true },
  { to: "/attendance", label: "Davomat", icon: CalendarCheck },
  { to: "/grades", label: "Baholar", icon: GraduationCap },
  { to: "/payments", label: "To'lovlar", icon: Banknote },
  { to: "/profile", label: "Profil", icon: User },
];

// Quick-access tiles on the home page — deliberately just these three
// parent-facing sections. Chat stays reachable via the corner button; the
// other routes still exist but are intentionally not surfaced as tiles.
export const PORTAL_QUICK_LINKS = [
  { to: "/news", label: "Yangiliklar", icon: Megaphone },
  { to: "/homework", label: "Uy vazifasi", icon: BookOpen },
  { to: "/behaviour", label: "Xulq-atvor", icon: Smile },
];

// Parent-facing booking status: label + Badge variant.
export const BOOKING_STATUS = {
  pending: { label: "Kutilmoqda", variant: "warning" },
  confirmed: { label: "Tasdiqlandi", variant: "success" },
  cancelled: { label: "Bekor qilindi", variant: "danger" },
};

// Turnstile direction: label + tone for the timeline icon.
export const TURNSTILE_DIRECTION = {
  in: { label: "Kirdi", tone: "success" },
  out: { label: "Chiqdi", tone: "danger" },
};
