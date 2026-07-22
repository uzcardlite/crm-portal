import { Check, Clock, X } from "lucide-react";
import { formatDate, formatMoney } from "../../utils/format";
import { cn } from "../../utils/cn";

const STATUS_STYLES = {
  paid: { className: "bg-success-bg text-success", icon: Check },
  unpaid: { className: "bg-danger-bg text-danger", icon: X },
  late: { className: "bg-accent-light/40 text-accent-dark", icon: Clock },
};

export default function PaymentRow({ date, title, amount, status = "paid" }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.paid;
  const Icon = style.icon;

  return (
    <div className="flex items-center gap-3 border-b border-gray-50 py-3 last:border-0">
      <span
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
          style.className,
        )}
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{formatDate(date)}</p>
      </div>
      <span className="flex-shrink-0 text-sm font-semibold tabular-nums text-gray-900">
        {formatMoney(amount)}
      </span>
    </div>
  );
}
