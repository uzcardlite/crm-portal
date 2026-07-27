import { useCallback, useMemo } from "react";
import { BookOpen, CalendarClock } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import SectionHeader from "../components/portal/SectionHeader";
import { getPortalHomework } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatDate } from "../utils/format";
import { toIsoDate } from "../utils/portalSchedule";
import { cn } from "../utils/cn";

export default function PortalHomework() {
  const { activeStudentId, activeStudent } = usePortalAuth();
  const todayIso = useMemo(() => toIsoDate(new Date()), []);

  const enabled = Boolean(activeStudentId);
  const loadHomework = useCallback(() => getPortalHomework(activeStudentId), [activeStudentId]);
  const homework = usePortalResource(loadHomework, enabled);

  // Backend order is not guaranteed — sort by due_date descending here.
  const items = useMemo(
    () =>
      [...(homework.data ?? [])].sort((a, b) =>
        String(b.due_date ?? "").localeCompare(String(a.due_date ?? "")),
      ),
    [homework.data],
  );

  return (
    <>
      <PortalPageHeader title="Uy vazifasi" subtitle={activeStudent?.full_name} />

      {homework.loading ? (
        <>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-card" />
          ))}
        </>
      ) : homework.error ? (
        <PortalErrorState onRetry={homework.reload} />
      ) : items.length === 0 ? (
        <EmptyState
          size="md"
          icon={BookOpen}
          title="Uy vazifasi yo'q"
          description="O'qituvchi vazifa bergach shu yerda ko'rinadi."
        />
      ) : (
        <>
          <SectionHeader title="Barcha vazifalar" count={items.length} />
          {items.map((task) => {
            // A due date in the past is de-emphasised, not hidden — it is still
            // useful history for the parent.
            const overdue =
              task.due_date && String(task.due_date).slice(0, 10) < todayIso;
            return (
              <Card key={task.id} padding="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg">{task.title}</p>
                      <p className="mt-0.5 truncate text-xs text-fg-muted">
                        {task.group_name}
                        {task.teacher_name ? ` · ${task.teacher_name}` : ""}
                      </p>
                    </div>
                    {task.due_date && (
                      <span
                        className={cn(
                          "inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                          overdue
                            ? "bg-surface-sunken text-fg-muted"
                            : "bg-accent-light/30 text-accent-dark dark:bg-accent/15 dark:text-accent",
                        )}
                      >
                        <CalendarClock size={13} />
                        {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="whitespace-pre-line text-sm text-fg-secondary">
                      {task.description}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </>
      )}
    </>
  );
}
