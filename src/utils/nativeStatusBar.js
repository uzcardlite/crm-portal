import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

// Dark icons/text over the app's light background (see index.css safe-area
// padding for the overlay itself). No-op on web.
export function setupNativeStatusBar() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  StatusBar.setStyle({ style: Style.Light }).catch(() => {});
}
