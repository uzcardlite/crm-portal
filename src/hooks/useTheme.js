import { useCallback, useState } from "react";
import { getStoredTheme, setTheme as persistTheme } from "../utils/theme";

// Small stateful wrapper around utils/theme so a toggle button can flip the
// theme and re-render with the current value.
export function useTheme() {
  const [theme, setThemeState] = useState(getStoredTheme);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
