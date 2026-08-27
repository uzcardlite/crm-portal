import { Building2, Send } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import Card from "../components/ui/Card";
import { usePortalAuth } from "../context/PortalAuthContext";

// What the centre has told the app about itself. Address, phone and hours are
// not on the API yet, so this only claims what is real — the name — and says
// plainly where to go for anything else, rather than inventing contact details.
export default function PortalAbout() {
  const { activeStudent } = usePortalAuth();

  return (
    <PageShell>
      <PageTitle title="Markaz haqida" />

      <div className="flex flex-col gap-[13px] px-4 pb-[108px] pt-3.5">
        <Card className="flex items-center gap-3">
          <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[14px] bg-carrot/[.16] text-carrot-bright">
            <Building2 size={19} strokeWidth={2.1} />
          </span>
          <span className="min-w-0">
            <b className="block truncate text-[13px] font-bold text-ink">
              {activeStudent?.tenant_name || "O'quv markazi"}
            </b>
            <span className="mt-0.5 block text-[9.5px] font-semibold text-ink-faint">
              {activeStudent?.full_name} shu markazda o'qiydi
            </span>
          </span>
        </Card>

        <Card className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-btn bg-sky/[.15] text-sky">
            <Send size={14} strokeWidth={2.1} />
          </span>
          <span className="min-w-0">
            <b className="block text-[11px] font-bold text-ink">
              Manzil, telefon va ish vaqti hali qo'shilmagan
            </b>
            <span className="mt-1 block text-[9.5px] font-semibold leading-relaxed text-ink-faint">
              Savol bo'lsa, Chatlar bo'limidan ustozga yozing — u sizni to'g'ri
              odamga yo'naltiradi.
            </span>
          </span>
        </Card>
      </div>
    </PageShell>
  );
}
