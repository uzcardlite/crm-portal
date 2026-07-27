import { useCallback, useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import { getPortalMenu } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatDate } from "../utils/format";

// Free-text `items` is stored one dish per line — split into a list, drop blanks.
function itemLines(items) {
  return String(items ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function PortalMenu() {
  const { activeStudentId, activeStudent } = usePortalAuth();

  const enabled = Boolean(activeStudentId);
  const loadMenu = useCallback(() => getPortalMenu(activeStudentId, "week"), [activeStudentId]);
  const menu = usePortalResource(loadMenu, enabled);

  const days = useMemo(() => menu.data ?? [], [menu.data]);

  return (
    <>
      <PortalPageHeader title="Menyu" subtitle={activeStudent?.full_name} />

      {menu.loading ? (
        <>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-card" />
          ))}
        </>
      ) : menu.error ? (
        <PortalErrorState onRetry={menu.reload} />
      ) : days.length === 0 ? (
        <EmptyState
          size="md"
          icon={UtensilsCrossed}
          title="Menyu kiritilmagan"
          description="Yaqin kunlar uchun ovqat menyusi hali qo'shilmagan."
        />
      ) : (
        days.map((day) => {
          const lines = itemLines(day.items);
          return (
            <Card key={day.id} padding="p-4">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-fg">{formatDate(day.date)}</p>
                {lines.length === 0 ? (
                  <p className="text-sm text-fg-muted">{day.items}</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {lines.map((line, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                        <span className="text-sm text-fg-secondary">{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {day.note && (
                  <p className="rounded-btn bg-accent-light/20 px-3 py-2 text-xs text-accent-dark dark:bg-accent/15 dark:text-accent-light">
                    {day.note}
                  </p>
                )}
              </div>
            </Card>
          );
        })
      )}
    </>
  );
}
