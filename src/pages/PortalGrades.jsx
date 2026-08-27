import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import PeriodSegment from "../components/ui/PeriodSegment";
import MasteryCard from "../components/grades/MasteryCard";
import Insight from "../components/grades/Insight";
import TrendChart from "../components/grades/TrendChart";
import SubjectList from "../components/grades/SubjectList";
import RecentGrades from "../components/grades/RecentGrades";
import PortalErrorState from "../components/portal/PortalErrorState";
import { PERIODS, useGradesData } from "../hooks/useGradesData";

// Where the child stands, which way they are moving, in which subject, and off
// what marks — in that order, because that is the order the questions come.
export default function PortalGrades() {
  const [period, setPeriod] = useState("month");
  const grades = useGradesData(period);

  return (
    <PageShell>
      <PageTitle
        title="Baholash"
        subtitle={
          grades.subjects.length > 0
            ? grades.subjects.map((subject) => subject.subject).join(" · ")
            : null
        }
      />

      <div className="flex flex-col gap-[13px] px-4 pb-[108px] pt-3.5">
        <PeriodSegment periods={PERIODS} value={period} onChange={setPeriod} />

        {grades.error ? (
          <PortalErrorState
            size="md"
            title="Baholarni yuklab bo'lmadi"
            onRetry={grades.reload}
          />
        ) : (
          <>
            <MasteryCard
              percent={grades.mastery}
              average5={grades.average5}
              total={grades.total}
              delta={grades.masteryDelta}
              loading={grades.loading}
            />

            <Insight insight={grades.insight} />

            <TrendChart points={grades.trend} />

            <SubjectList subjects={grades.subjects} />

            <RecentGrades grades={grades.recent} teacherOf={grades.teacherOf} />
          </>
        )}
      </div>
    </PageShell>
  );
}
