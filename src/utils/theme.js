// Single source of truth for the light/dark theme. The initial class is set by
// the inline script in index.html (before first paint); these helpers keep the
// React side in sync and persist the user's choice.
import { setupNativeStatusBar } from "./nativeStatusBar";

export const THEME_KEY = "crm_theme";

// Stored choice wins; otherwise fall back to the OS preference.
export function getStoredTheme() {
  const value = localStorage.getItem(THEME_KEY);
  if (value === "dark" || value === "light") return value;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  // Re-sync the native (APK) status-bar icon color to the new theme.
  setupNativeStatusBar();
}
