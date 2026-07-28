import { useCallback } from "react";
import { Megaphone } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import SectionHeader from "../components/portal/SectionHeader";
import { getPortalNews } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatDate } from "../utils/format";

export default function PortalNews() {
  const { activeStudentId } = usePortalAuth();

  const enabled = Boolean(activeStudentId);
  const loadNews = useCallback(() => getPortalNews(activeStudentId), [activeStudentId]);
  const news = usePortalResource(loadNews, enabled);
  const items = news.data ?? [];

  return (
    <>
      <PortalPageHeader title="Yangiliklar" />

      {news.loading ? (
        <>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-card" />
          ))}
        </>
      ) : news.error ? (
        <PortalErrorState onRetry={news.reload} />
      ) : items.length === 0 ? (
        <EmptyState
          size="md"
          icon={Megaphone}
          title="Yangilik yo'q"
          description="Yangi e'lonlar shu yerda ko'rinadi."
        />
      ) : (
        <>
          <SectionHeader title="E'lonlar" count={items.length} />
          {items.map((item) => (
            <Card key={item.id} padding="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-sm font-semibold text-fg">{item.title}</p>
                  <span className="flex-shrink-0 text-xs text-fg-muted">
                    {formatDate(item.published_at || item.created_at)}
                  </span>
                </div>
                <p className="whitespace-pre-line text-sm text-fg-secondary">{item.body}</p>
              </div>
            </Card>
          ))}
        </>
      )}
    </>
  );
}
