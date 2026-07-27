import { useCallback, useMemo } from "react";
import { Smile } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import SectionHeader from "../components/portal/SectionHeader";
import { getPortalBehaviour } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatDate } from "../utils/format";
import { cn } from "../utils/cn";

// A signed integer as a display string: +5, -3, 0.
function signed(value) {
  const number = Number(value ?? 0);
  return number > 0 ? `+${number}` : String(number);
}

// Positive points read green, negative read red, zero stays neutral.
function toneClass(value, kind) {
  const number = Number(value ?? 0);
  if (number > 0) return kind === "chip" ? "bg-success-bg text-success" : "text-success";
  if (number < 0) return kind === "chip" ? "bg-danger-bg text-danger" : "text-danger";
  return kind === "chip" ? "bg-surface-sunken text-fg-muted" : "text-fg";
}

export default function PortalBehaviour() {
  const { activeStudentId, activeStudent } = usePortalAuth();

  const enabled = Boolean(activeStudentId);
  const loadBehaviour = useCallback(() => getPortalBehaviour(activeStudentId), [activeStudentId]);
  const behaviour = usePortalResource(loadBehaviour, enabled);

  // Backend order is not guaranteed — sort by date descending here.
  const items = useMemo(
    () =>
      [...(behaviour.data ?? [])].sort((a, b) =>
        String(b.date ?? "").localeCompare(String(a.date ?? "")),
      ),
    [behaviour.data],
  );

  const now = useMemo(() => new Date(), []);
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Two running totals: this calendar month and all-time.
  const totals = useMemo(() => {
    let thisMonth = 0;
    let overall = 0;
    items.forEach((entry) => {
      const points = Number(entry.points ?? 0);
      overall += points;
      if (String(entry.date).slice(0, 7) === currentMonthPrefix) thisMonth += points;
    });
    return { thisMonth, overall };
  }, [items, currentMonthPrefix]);

  return (
    <>
      <PortalPageHeader title="Xulq-atvor" subtitle={activeStudent?.full_name} />

      {behaviour.loading ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[76px] rounded-card" />
            <Skeleton className="h-[76px] rounded-card" />
          </div>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-card" />
          ))}
        </>
      ) : behaviour.error ? (
        <PortalErrorState onRetry={behaviour.reload} />
      ) : items.length === 0 ? (
        <EmptyState
          size="md"
          icon={Smile}
          title="Xulq-atvor bahosi yo'q"
          description="O'qituvchi ball qo'ygach shu yerda ko'rinadi."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Card padding="p-4">
              <p
                className={cn(
                  "text-lg font-semibold tabular-nums",
                  toneClass(totals.thisMonth),
                )}
              >
                {signed(totals.thisMonth)}
              </p>
              <p className="mt-1 text-xs text-fg-muted">Bu oy</p>
            </Card>
            <Card padding="p-4">
              <p className={cn("text-lg font-semibold tabular-nums", toneClass(totals.overall))}>
                {signed(totals.overall)}
              </p>
              <p className="mt-1 text-xs text-fg-muted">Jami</p>
            </Card>
          </div>

          <SectionHeader title="Barcha baholar" count={items.length} />
          {items.map((entry) => (
            <Card key={entry.id} padding="p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-10 min-w-[2.75rem] flex-shrink-0 items-center justify-center rounded-full px-2 text-sm font-bold tabular-nums",
                    toneClass(entry.points, "chip"),
                  )}
                >
                  {signed(entry.points)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{entry.group_name}</p>
                  <p className="mt-0.5 truncate text-xs text-fg-muted">
                    {entry.teacher_name ? `${entry.teacher_name} · ` : ""}
                    {formatDate(entry.date)}
                  </p>
                  {entry.note && (
                    <p className="mt-1.5 whitespace-pre-line text-sm text-fg-secondary">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </>
  );
}
