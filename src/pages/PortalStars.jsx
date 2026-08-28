import { useCallback } from "react";
import { Star } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import SectionHeader from "../components/ui/SectionHeader";
import PortalErrorState from "../components/portal/PortalErrorState";
import { getPortalReactions, getPortalStars } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatRelativeDate } from "../utils/format";

// The stars total is the sum of every reaction a teacher has given — this
// screen is that same number, plus the list it is built from.
export default function PortalStars() {
  const { activeStudentId } = usePortalAuth();
  const enabled = Boolean(activeStudentId);

  const loadStars = useCallback(() => getPortalStars(activeStudentId), [activeStudentId]);
  const loadReactions = useCallback(() => getPortalReactions(activeStudentId), [activeStudentId]);
  const stars = usePortalResource(loadStars, enabled);
  const reactions = usePortalResource(loadReactions, enabled);

  const loading = stars.loading || reactions.loading;
  const total = stars.data?.total ?? 0;
  const rows = reactions.data ?? [];

  return (
    <PageShell>
      <PageTitle title="Yulduzchalar" />

      <div className="flex flex-col gap-[13px] px-4 pb-[108px] pt-3.5">
        {stars.error ? (
          <PortalErrorState size="md" title="Yulduzchalarni yuklab bo'lmadi" onRetry={stars.reload} />
        ) : (
          <div className="relative overflow-hidden rounded-card border border-line bg-surface p-[15px] text-center">
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-[130px] w-[130px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,138,69,.28),transparent_70%)]"
            />
            <span className="relative mx-auto grid h-14 w-14 place-items-center">
              <Star size={30} className="fill-carrot-bright text-carrot-bright" />
            </span>
            {loading ? (
              <Skeleton className="relative mx-auto mt-2 h-7 w-16" />
            ) : (
              <b className="relative mt-2 block font-display text-[24px] font-bold tracking-tight text-ink tnum">
                {total}
              </b>
            )}
            <span className="relative mt-1 block text-[9.5px] font-bold uppercase tracking-[.07em] text-ink-faint">
              yig'ilgan yulduzcha
            </span>
            {!loading && stars.data?.rank && (
              <span className="relative mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-[5px] text-[9.5px] font-bold text-ink-soft">
                Guruhda <b className="text-ink">#{stars.data.rank}</b>
                {stars.data.group_size ? ` / ${stars.data.group_size} o'quvchidan` : ""}
              </span>
            )}
          </div>
        )}

        <Card>
          <SectionHeader title="Qayerdan yig'ilgan" />

          {reactions.error ? (
            <PortalErrorState size="sm" title="Ro'yxatni yuklab bo'lmadi" onRetry={reactions.reload} />
          ) : loading ? (
            <div className="mt-2 flex flex-col gap-2">
              {[0, 1, 2].map((index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              icon={Star}
              text="Yulduzchalar hali yig'ilmagan"
              description="Ustoz darsda ko'rsatgan yutuqlar uchun yulduzcha berganda, shu yerda ko'rinadi."
            />
          ) : (
            <div className="mt-1">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-2.5 border-b border-line py-[9px] last:border-b-0"
                >
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-carrot/15 text-[17px]">
                    {row.emoji}
                  </span>

                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-[10.5px] font-bold text-ink">
                      {row.note || `${row.teacher_name} reaksiya berdi`}
                    </b>
                    <span className="mt-0.5 block truncate text-[8.5px] font-semibold text-ink-faint">
                      {[row.teacher_name, row.group_name].filter(Boolean).join(" · ")}
                    </span>
                  </span>

                  <span className="flex-none text-right">
                    <b className="block text-[11px] font-extrabold text-carrot-bright">+{row.points}</b>
                    <span className="mt-0.5 block text-[8px] font-bold text-ink-faint">
                      {formatRelativeDate(row.created_at)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
