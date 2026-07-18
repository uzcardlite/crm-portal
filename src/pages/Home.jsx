import { useEffect, useState } from "react";
import { CalendarCheck, Wallet } from "lucide-react";
import { getStudentSummary } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import { toast } from "../components/ui/Toast";
import { getErrorMessage } from "../utils/apiError";

function formatMoney(value) {
  return `${Number(value).toLocaleString("uz-UZ")} so'm`;
}

export default function Home() {
  const { activeStudentId } = usePortalAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeStudentId) return;
    setLoading(true);
    getStudentSummary(activeStudentId)
      .then(setSummary)
      .catch((error) => toast.error(getErrorMessage(error, "Ma'lumotni yuklab bo'lmadi")))
      .finally(() => setLoading(false));
  }, [activeStudentId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <CalendarCheck size={16} />
            <span className="text-xs">Davomat (oy)</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{summary.attendance_percent}%</span>
        </Card>
        <Card className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Wallet size={16} />
            <span className="text-xs">Qarz holati</span>
          </div>
          {summary.debt.has_debt ? (
            <Badge variant="danger">{formatMoney(summary.debt.amount)}</Badge>
          ) : (
            <Badge variant="success">Qarz yo'q</Badge>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">So'nggi voqealar</h2>
        {summary.recent_events.length === 0 ? (
          <p className="text-sm text-gray-500">Hali voqealar yo'q</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {summary.recent_events.map((event, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{event.label}</span>
                <span className="text-xs text-gray-400">
                  {new Date(event.date).toLocaleDateString("uz-UZ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
