import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

// Match the status-bar icon/text color to the active theme: dark icons over the
// light UI, light icons over the deep-navy night UI. No-op on web.
export function setupNativeStatusBar() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  const isDark = document.documentElement.classList.contains("dark");
  StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light }).catch(() => {});
}
