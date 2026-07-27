import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({ title, to, count }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-fg">
        {title}
        {count !== undefined && count !== null && (
          <span className="ml-1.5 text-sm font-normal text-fg-faint">{count}</span>
        )}
      </h2>
      {to && (
        <Link
          to={to}
          className="inline-flex items-center gap-0.5 text-sm font-medium text-accent-dark transition-colors dark:text-accent"
        >
          Barchasi
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
