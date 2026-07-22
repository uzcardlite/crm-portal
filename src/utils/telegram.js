// Helpers around the Telegram Mini App SDK (window.Telegram.WebApp).
// The object can be present with empty initData when the page is opened in a
// normal browser, so presence alone is not a reliable Mini App signal.

export function getTelegramWebApp() {
  return window.Telegram?.WebApp ?? null;
}

export function getTelegramInitData() {
  return getTelegramWebApp()?.initData || "";
}

export function isTelegramMiniApp() {
  return getTelegramInitData().length > 0;
}

// Signals to Telegram that the app is ready to be displayed and expands it
// to full height. Safe to call outside Telegram — every access is optional.
export function setupTelegramWebApp() {
  const webApp = getTelegramWebApp();
  webApp?.ready?.();
  webApp?.expand?.();
}
