import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/cn";

// One-tap light/dark switch. Sun while dark (tap -> go light), Moon while
// light (tap -> go dark), matching the Ustoz app's ProfileDropdown control.
export default function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Kunduzgi rejim" : "Tungi rejim"}
      title={isDark ? "Kunduzgi rejim" : "Tungi rejim"}
      className={cn(
        "inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg-secondary",
        className,
      )}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
