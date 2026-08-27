import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import PageTitle from "../components/ui/PageTitle";
import PeriodSegment from "../components/ui/PeriodSegment";
import AttendanceSummary from "../components/attendance/AttendanceSummary";
import StreakCard from "../components/attendance/StreakCard";
import MonthThread from "../components/attendance/MonthThread";
import LessonRows from "../components/attendance/LessonRows";
import MonthBars from "../components/attendance/MonthBars";
import { PERIODS, useAttendanceData } from "../hooks/useAttendanceData";

// How often the child is in class, then which days, then what happened on each
// one — and under every lesson, when they actually came through the gate.
export default function PortalAttendance() {
  const [period, setPeriod] = useState("month");
  const [group, setGroup] = useState(null);
  const attendance = useAttendanceData(period);

  return (
    <PageShell>
      <PageTitle
        title="Davomat"
        subtitle={
          attendance.lessonCount > 0
            ? `${attendance.lessonCount} dars kuni${
                attendance.groups.length > 1 ? ` · ${attendance.groups.length} guruh` : ""
              }`
            : null
        }
      />

      <div className="flex flex-col gap-[13px] px-4 pb-[108px] pt-3.5">
        <PeriodSegment periods={PERIODS} value={period} onChange={setPeriod} />

        <AttendanceSummary summary={attendance.summary} loading={attendance.loading} />

        <StreakCard current={attendance.streak.current} best={attendance.streak.best} />

        <MonthThread
          days={attendance.thread}
          monthLabel={attendance.monthLabel}
          canGoForward={attendance.canGoForward}
          onBack={attendance.goBack}
          onForward={attendance.goForward}
        />

        <LessonRows
          rows={attendance.rows}
          groups={attendance.groups}
          filter={group}
          onFilter={setGroup}
        />

        <MonthBars months={attendance.months} />
      </div>
    </PageShell>
  );
}
