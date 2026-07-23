import { Menu } from "lucide-react";

// Mobile-only top bar. The brand sits on the left, the menu button on the
// right opens the slide-in drawer. Hidden on md+ where the top tab bar shows.
export default function PortalAppBar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <span className="text-lg font-semibold text-gray-900">Farzandim</span>
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Menyu"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors active:bg-gray-100"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
