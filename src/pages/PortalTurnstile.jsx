import { useCallback, useMemo } from "react";
import { DoorOpen, LogIn, LogOut } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import SectionHeader from "../components/portal/SectionHeader";
import { getPortalTurnstile } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { TURNSTILE_DIRECTION } from "../constants/portal";
import { formatDate, formatTime } from "../utils/format";
import { cn } from "../utils/cn";

const TONE_STYLES = {
  success: "bg-success-bg text-success",
  danger: "bg-danger-bg text-danger",
};

// Group events (already time-desc from the server) under a per-day header.
function groupByDate(events) {
  const groups = [];
  let current = null;
  events.forEach((event) => {
    const key = String(event.event_time).slice(0, 10);
    if (!current || current.key !== key) {
      current = { key, date: event.event_time, events: [] };
      groups.push(current);
    }
    current.events.push(event);
  });
  return groups;
}

export default function PortalTurnstile() {
  const { activeStudentId, activeStudent } = usePortalAuth();

  const enabled = Boolean(activeStudentId);
  const loadEvents = useCallback(() => getPortalTurnstile(activeStudentId), [activeStudentId]);
  const turnstile = usePortalResource(loadEvents, enabled);

  const groups = useMemo(() => groupByDate(turnstile.data ?? []), [turnstile.data]);

  return (
    <>
      <PortalPageHeader title="Kirish-chiqish" subtitle={activeStudent?.full_name} />

      {turnstile.loading ? (
        <Card padding="p-4">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="mt-2 h-12" />
          ))}
        </Card>
      ) : turnstile.error ? (
        <PortalErrorState onRetry={turnstile.reload} />
      ) : groups.length === 0 ? (
        <EmptyState
          size="md"
          icon={DoorOpen}
          title="Yozuvlar yo'q"
          description="Turniketdan kirish-chiqish qayd etilmagan."
        />
      ) : (
        groups.map((group) => (
          <Card key={group.key} padding="p-4">
            <div className="flex flex-col gap-3">
              <SectionHeader title={formatDate(group.date)} count={group.events.length} />
              <div>
                {group.events.map((event) => {
                  const meta = TURNSTILE_DIRECTION[event.direction] ?? TURNSTILE_DIRECTION.in;
                  const Icon = event.direction === "out" ? LogOut : LogIn;
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 border-b border-gray-50 py-3 last:border-0"
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                          TONE_STYLES[meta.tone],
                        )}
                      >
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{meta.label}</p>
                        {event.device_name && (
                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {event.device_name}
                          </p>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                        {formatTime(event.event_time)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))
      )}
    </>
  );
}
