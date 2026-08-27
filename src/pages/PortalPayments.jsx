import { useCallback, useMemo } from "react";
import { AlertTriangle, Check, Wallet } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import SectionHeader from "../components/ui/SectionHeader";
import Skeleton from "../components/ui/Skeleton";
import PortalErrorState from "../components/portal/PortalErrorState";
import { getPortalPayments } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { formatDate, formatMoney, formatMonth } from "../utils/format";

const METHOD = {
  cash: "Naqd",
  card: "Karta",
  transfer: "O'tkazma",
  click: "Click",
  payme: "Payme",
};

// Whether anything is owed, then what has been paid. The status is answered
// before the history, because that is the only question most parents open this
// screen with.
export default function PortalPayments() {
  const { activeStudentId } = usePortalAuth();
  const load = useCallback(() => getPortalPayments(activeStudentId), [activeStudentId]);
  const payments = usePortalResource(load, Boolean(activeStudentId));

  const history = useMemo(
    () =>
      [...(payments.data?.history ?? [])].sort((a, b) =>
        String(b.payment_date).localeCompare(String(a.payment_date)),
      ),
    [payments.data],
  );

  const debt = payments.data?.debt;
  const hasDebt = Boolean(debt?.has_debt);

  return (
    <PageShell>
      <PageTitle title="To'lovlar" subtitle={history.length > 0 ? `${history.length} ta to'lov` : null} />

      <div className="flex flex-col gap-[13px] px-4 pb-[108px] pt-3.5">
        {payments.loading ? (
          <>
            <Skeleton className="h-[92px] rounded-card" />
            <Skeleton className="h-40 rounded-card" />
          </>
        ) : payments.error ? (
          <PortalErrorState size="md" title="To'lovlarni yuklab bo'lmadi" onRetry={payments.reload} />
        ) : (
          <>
            <div
              className={`relative overflow-hidden rounded-card border p-[15px] ${
                hasDebt
                  ? "border-rose/[.3] bg-[linear-gradient(140deg,rgba(245,118,107,.18),rgba(245,118,107,.05))]"
                  : "border-teal/[.28] bg-[linear-gradient(140deg,rgba(52,201,163,.18),rgba(52,201,163,.05))]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute -right-10 -top-12 h-[130px] w-[130px] rounded-full ${
                  hasDebt
                    ? "bg-[radial-gradient(circle,rgba(245,118,107,.35),transparent_70%)]"
                    : "bg-[radial-gradient(circle,rgba(52,201,163,.35),transparent_70%)]"
                }`}
              />
              <div className="relative flex items-center gap-3">
                <span
                  className={`grid h-[42px] w-[42px] flex-none place-items-center rounded-[14px] ${
                    hasDebt ? "bg-rose/20 text-rose" : "bg-teal/20 text-teal"
                  }`}
                >
                  {hasDebt ? <AlertTriangle size={19} strokeWidth={2.2} /> : <Check size={19} strokeWidth={2.8} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold uppercase tracking-[.07em] text-ink-faint">
                    {hasDebt ? "To'lanmagan summa" : "Holat"}
                  </span>
                  <b className="mt-0.5 block font-display text-[20px] font-bold leading-none tracking-tight text-ink tnum">
                    {hasDebt ? formatMoney(debt.amount) : "Qarz yo'q"}
                  </b>
                </span>
              </div>
            </div>

            <Card>
              <SectionHeader title="To'lovlar tarixi" aside={history.length > 0 ? `${history.length} ta` : null} />

              {history.length === 0 ? (
                <EmptyState icon={Wallet} text="Hali to'lov qayd etilmagan" />
              ) : (
                <div className="mt-1">
                  {history.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center gap-2.5 border-b border-line py-[9px] last:border-b-0"
                    >
                      <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[12px] bg-teal/15 text-teal">
                        <Check size={15} strokeWidth={2.6} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <b className="block truncate text-[10.5px] font-bold text-ink">
                          {payment.month_for ? `${formatMonth(payment.month_for)} uchun` : "To'lov"}
                        </b>
                        <span className="mt-px block truncate text-[8.5px] font-semibold text-ink-faint">
                          {formatDate(payment.payment_date)}
                          {payment.method ? ` · ${METHOD[payment.method] || payment.method}` : ""}
                        </span>
                      </span>
                      <span className="flex-none font-display text-[13px] font-bold tracking-tight text-ink tnum">
                        {formatMoney(payment.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </PageShell>
  );
}
