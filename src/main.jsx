import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Native (Capacitor) only: hand the native launch splash off to the in-app UI
// for a seamless start now that the app ships as a local bundle (no more
// waiting on portal.ncrm.uz to load before anything appears), and paint the
// status bar to match the current theme.
const cap = typeof window !== "undefined" ? window.Capacitor : undefined;
if (cap?.isNativePlatform?.()) {
  const p = cap.Plugins || {};
  const applyStatusBar = () => {
    const dark = document.documentElement.classList.contains("dark");
    p.StatusBar?.setOverlaysWebView?.({ overlay: true });
    p.StatusBar?.setStyle?.({ style: dark ? "LIGHT" : "DARK" });
  };
  requestAnimationFrame(() => {
    p.SplashScreen?.hide?.({ fadeOutDuration: 200 });
    applyStatusBar();
  });
  new MutationObserver(applyStatusBar).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
