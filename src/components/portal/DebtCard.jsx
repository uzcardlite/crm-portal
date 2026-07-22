import { AlertCircle, CheckCircle2 } from "lucide-react";
import Card from "../ui/Card";
import { formatMoney } from "../../utils/format";

// Read-only by design: the portal has no payment endpoint, so there is no
// "To'lash" button here.
export default function DebtCard({ amount, dueLabel }) {
  const value = Number(amount ?? 0);
  const hasDebt = value > 0;

  if (!hasDebt) {
    return (
      <Card padding="p-4" className="border-success-bg bg-success-bg">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-success">
            <CheckCircle2 size={20} />
          </span>
          <p className="text-sm font-semibold text-success">Qarzdorlik yo'q</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="p-4" className="border-danger-bg bg-danger-bg">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-danger">
          <AlertCircle size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-danger">Qarzdorlik</p>
          <p className="text-lg font-semibold tabular-nums text-danger">
            {formatMoney(value)}
          </p>
          {dueLabel && <p className="text-xs text-gray-500">{dueLabel}</p>}
        </div>
      </div>
    </Card>
  );
}
