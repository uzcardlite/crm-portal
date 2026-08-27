import { Star } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

// Stars have no backend yet — this is the honest state until they do, not a
// mock feed. When teachers can award them, this screen fills with a history
// list and stays otherwise unchanged.
export default function PortalStars() {
  return (
    <PageShell>
      <PageTitle title="Yulduzchalar" />

      <div className="flex flex-col gap-[13px] px-4 pb-[108px] pt-3.5">
        <div className="relative overflow-hidden rounded-card border border-line bg-surface p-[15px] text-center">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-[130px] w-[130px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,138,69,.28),transparent_70%)]"
          />
          <span className="relative mx-auto grid h-14 w-14 place-items-center">
            <Star size={30} className="fill-carrot-bright text-carrot-bright" />
          </span>
          <b className="relative mt-2 block font-display text-[24px] font-bold tracking-tight text-ink tnum">
            0
          </b>
          <span className="relative mt-1 block text-[9.5px] font-bold uppercase tracking-[.07em] text-ink-faint">
            yig'ilgan yulduzcha
          </span>
        </div>

        <Card>
          <EmptyState
            icon={Star}
            text="Yulduzchalar hali yig'ilmagan"
            description="Ustozlar tez orada darsda ko'rsatgan yutuqlar uchun yulduzcha bera boshlaydi."
          />
        </Card>
      </div>
    </PageShell>
  );
}
