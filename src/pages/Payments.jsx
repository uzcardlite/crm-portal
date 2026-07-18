import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { getStudentPayments } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { toast } from "../components/ui/Toast";
import { getErrorMessage } from "../utils/apiError";

const METHOD_LABELS = {
  cash: "Naqd",
  transfer: "O'tkazma",
  click: "Click",
  payme: "Payme",
};

function formatMoney(value) {
  return `${Number(value).toLocaleString("uz-UZ")} so'm`;
}

export default function Payments() {
  const { activeStudentId } = usePortalAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeStudentId) return;
    setLoading(true);
    getStudentPayments(activeStudentId)
      .then(setData)
      .catch((error) => toast.error(getErrorMessage(error, "To'lovlarni yuklab bo'lmadi")))
      .finally(() => setLoading(false));
  }, [activeStudentId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 p-4">
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <Wallet size={18} />
          <span className="text-sm font-medium">Joriy qarz</span>
        </div>
        {data.debt.has_debt ? (
          <Badge variant="danger">{formatMoney(data.debt.amount)}</Badge>
        ) : (
          <Badge variant="success">Qarz yo'q</Badge>
        )}
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-900">To'lovlar tarixi</h2>
        {data.history.length === 0 ? (
          <EmptyState icon={Wallet} title="Hali to'lovlar yo'q" />
        ) : (
          <div className="flex flex-col gap-2">
            {data.history.map((payment) => (
              <Card key={payment.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatMoney(payment.amount)}</p>
                  <p className="text-xs text-gray-500">
                    {METHOD_LABELS[payment.method] || payment.method} •{" "}
                    {new Date(payment.payment_date).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
