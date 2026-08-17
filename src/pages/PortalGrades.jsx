import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, GraduationCap } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ProgressRing from "../components/ui/ProgressRing";
import Skeleton from "../components/ui/Skeleton";
import GradeRow from "../components/portal/GradeRow";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import SectionHeader from "../components/portal/SectionHeader";
import { getPortalDailyGrades, getPortalGrades } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatDate } from "../utils/format";
import { cn } from "../utils/cn";

const ALL_GROUPS = "all";

// score / max_score are Decimals — the JSON may carry them as strings.
function averagePercent(rows) {
  const totals = rows.reduce(
    (acc, grade) => {
      acc.score += Number(grade.score ?? 0);
      acc.max += Number(grade.max_score ?? 0);
      return acc;
    },
    { score: 0, max: 0 },
  );
  if (totals.max === 0) return null;
  return Math.min(100, Math.round((totals.score / totals.max) * 100));
}

export default function PortalGrades() {
  const { activeStudentId, activeStudent } = usePortalAuth();
  const [tab, setTab] = useState("daily");
  const [groupFilter, setGroupFilter] = useState(ALL_GROUPS);

  useEffect(() => {
    setGroupFilter(ALL_GROUPS);
  }, [activeStudentId]);

  const enabled = Boolean(activeStudentId);
  const loadGrades = useCallback(() => getPortalGrades(activeStudentId), [activeStudentId]);
  const loadDaily = useCallback(() => getPortalDailyGrades(activeStudentId), [activeStudentId]);
  const grades = usePortalResource(loadGrades, enabled);
  const daily = usePortalResource(loadDaily, enabled);

  const sorted = useMemo(
    () => [...(grades.data ?? [])].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [grades.data],
  );
  const dailySorted = useMemo(
    () => [...(daily.data ?? [])].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [daily.data],
  );

  const groups = useMemo(() => {
    const seen = new Map();
    for (const grade of sorted) {
      if (!seen.has(grade.group_id)) seen.set(grade.group_id, grade.group_name);
    }
    return [...seen.entries()].map(([id, name]) => ({ id, name }));
  }, [sorted]);

  const visible = useMemo(
    () =>
      groupFilter === ALL_GROUPS
        ? sorted
        : sorted.filter((grade) => String(grade.group_id) === groupFilter),
    [sorted, groupFilter],
  );

  const average = averagePercent(visible);

  const tabs = [
    { key: "daily", label: "Kunlik", icon: CalendarCheck },
    { key: "exam", label: "Imtihon", icon: GraduationCap },
  ];

  const active = tab === "daily" ? daily : grades;

  return (
    <>
      <PortalPageHeader title="Baholar" subtitle={activeStudent?.full_name} />

      <div className="flex gap-2">
        {tabs.map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-accent bg-accent-light/40 text-accent-dark"
                  : "border-line bg-surface text-fg-secondary",
              )}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      {active.loading ? (
        <Card padding="p-4">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="mt-2 h-12" />
          ))}
        </Card>
      ) : active.error ? (
        <PortalErrorState onRetry={active.reload} />
      ) : tab === "daily" ? (
        dailySorted.length === 0 ? (
          <EmptyState
            size="sm"
            icon={CalendarCheck}
            title="Kunlik baho hali yo'q"
            description="O'qituvchi dars kuni baho qo'ygach shu yerda ko'rinadi."
          />
        ) : (
          <Card padding="p-4">
            <div className="flex flex-col gap-3">
              <SectionHeader title="Kunlik baholar" count={dailySorted.length} />
              <div>
                {dailySorted.map((grade, index) => (
                  <GradeRow
                    key={`${grade.date}-${grade.group_name}-${index}`}
                    title={grade.group_name}
                    meta={grade.note ? `${formatDate(grade.date)} · ${grade.note}` : formatDate(grade.date)}
                    score={grade.score}
                    maxScore={grade.max_score}
                  />
                ))}
              </div>
            </div>
          </Card>
        )
      ) : sorted.length === 0 ? (
        <EmptyState
          size="sm"
          icon={GraduationCap}
          title="Baholar hali qo'yilmagan"
          description="Imtihon o'tkazilgach shu yerda ko'rinadi."
        />
      ) : (
        <>
          {average !== null && (
            <Card padding="p-4">
              <div className="flex items-center gap-4">
                <ProgressRing value={average} size={72}>
                  {`${average}%`}
                </ProgressRing>
                <div className="min-w-0">
                  <p className="text-xs text-fg-muted">O'rtacha baho</p>
                  <p className="text-xl font-semibold tabular-nums text-fg">{average}%</p>
                </div>
              </div>
            </Card>
          )}

          {groups.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {[{ id: ALL_GROUPS, name: "Barchasi" }, ...groups].map((group) => {
                const isActive = String(group.id) === groupFilter;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setGroupFilter(String(group.id))}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-accent bg-accent-light/40 text-accent-dark"
                        : "border-line bg-surface text-fg-secondary",
                    )}
                  >
                    {group.name}
                  </button>
                );
              })}
            </div>
          )}

          <Card padding="p-4">
            <div className="flex flex-col gap-3">
              <SectionHeader title="Guruhlar bo'yicha" count={visible.length} />
              {visible.length === 0 ? (
                <EmptyState size="sm" icon={GraduationCap} title="Bu guruhda baho yo'q" />
              ) : (
                <div>
                  {visible.map((grade) => (
                    <GradeRow
                      key={`${grade.exam_id}-${grade.group_id}`}
                      title={grade.exam_name}
                      meta={`${grade.group_name} · ${formatDate(grade.date)}`}
                      score={grade.score}
                      maxScore={grade.max_score}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
}
