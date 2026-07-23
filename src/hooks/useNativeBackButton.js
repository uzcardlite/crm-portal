import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

// Wires the Android hardware back button to the WebView's own navigation
// history: goes back while there is history, exits the app once there is
// none. No-op on web — Capacitor.isNativePlatform() is false there, so the
// browser's native back button behaviour is left untouched.
export function useNativeBackButton() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return undefined;
    }

    const listenerPromise = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, []);
}
