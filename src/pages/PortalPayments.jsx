import { useCallback, useMemo } from "react";
import { Banknote } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import DebtCard from "../components/portal/DebtCard";
import PaymentRow from "../components/portal/PaymentRow";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import SectionHeader from "../components/portal/SectionHeader";
import { getPortalPayments } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { METHOD_LABELS } from "../constants/moliya";
import { formatMoney, formatMonth } from "../utils/format";

export default function PortalPayments() {
  const { activeStudentId, activeStudent } = usePortalAuth();

  const enabled = Boolean(activeStudentId);
  const loadPayments = useCallback(() => getPortalPayments(activeStudentId), [activeStudentId]);
  const payments = usePortalResource(loadPayments, enabled);

  const history = useMemo(
    () =>
      [...(payments.data?.history ?? [])].sort((a, b) =>
        String(b.payment_date).localeCompare(String(a.payment_date)),
      ),
    [payments.data],
  );

  const now = useMemo(() => new Date(), []);
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const totals = useMemo(() => {
    let thisMonth = 0;
    let overall = 0;
    history.forEach((payment) => {
      const amount = Number(payment.amount ?? 0);
      overall += amount;
      if (String(payment.payment_date).slice(0, 7) === currentMonthPrefix) {
        thisMonth += amount;
      }
    });
    return { thisMonth, overall };
  }, [history, currentMonthPrefix]);

  const debt = payments.data?.debt;

  return (
    <>
      <PortalPageHeader title="To'lovlar" subtitle={activeStudent?.full_name} />

      {payments.loading ? (
        <>
          <Skeleton className="h-[72px] w-full rounded-card" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[76px] rounded-card" />
            <Skeleton className="h-[76px] rounded-card" />
          </div>
          <Card padding="p-4">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="mt-2 h-12" />
            ))}
          </Card>
        </>
      ) : payments.error ? (
        <PortalErrorState onRetry={payments.reload} />
      ) : (
        <>
          <DebtCard amount={debt?.has_debt ? debt.amount : 0} />

          <div className="grid grid-cols-2 gap-3">
            <Card padding="p-4">
              <p className="text-lg font-semibold tabular-nums text-gray-900">
                {formatMoney(totals.thisMonth)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Bu oy to'langan</p>
            </Card>
            <Card padding="p-4">
              <p className="text-lg font-semibold tabular-nums text-gray-900">
                {formatMoney(totals.overall)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Jami to'langan</p>
            </Card>
          </div>

          <Card padding="p-4">
            <div className="flex flex-col gap-3">
              <SectionHeader title="Tarix" count={history.length} />
              {history.length === 0 ? (
                <EmptyState size="sm" icon={Banknote} title="To'lovlar tarixi bo'sh" />
              ) : (
                <>
                  <div>
                    {history.map((payment) => (
                      <PaymentRow
                        key={payment.id}
                        date={payment.payment_date}
                        title={`${formatMonth(payment.month_for)} · ${
                          METHOD_LABELS[payment.method] ?? payment.method
                        }`}
                        amount={payment.amount}
                        status="paid"
                      />
                    ))}
                  </div>
                  {/* The endpoint caps the history at 100 rows and has no
                      pagination — say so instead of implying a full archive. */}
                  <p className="text-xs text-gray-400">So'nggi 100 ta to'lov</p>
                </>
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
}
