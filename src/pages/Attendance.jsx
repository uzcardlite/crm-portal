import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getStudentAttendance } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import Skeleton from "../components/ui/Skeleton";
import { toast } from "../components/ui/Toast";
import { getErrorMessage } from "../utils/apiError";
import { cn } from "../utils/cn";

const STATUS_STYLES = {
  present: "bg-success-bg text-success",
  absent: "bg-danger-bg text-danger",
  late: "bg-accent-light/40 text-accent-dark",
};

const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const WEEKDAY_LABELS = ["D", "S", "C", "P", "J", "S", "Y"];

export default function Attendance() {
  const { activeStudentId } = usePortalAuth();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [days, setDays] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeStudentId) return;
    setLoading(true);
    getStudentAttendance(activeStudentId, year, month)
      .then((data) => setDays(data.days))
      .catch((error) => toast.error(getErrorMessage(error, "Davomatni yuklab bo'lmadi")))
      .finally(() => setLoading(false));
  }, [activeStudentId, year, month]);

  function changeMonth(delta) {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Dushanba=0
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-btn text-gray-500 hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="flex h-8 w-8 items-center justify-center rounded-btn text-gray-500 hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {loading ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <div className="rounded-card border border-gray-100 bg-white p-3 shadow-card">
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
            {WEEKDAY_LABELS.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (day === null) return <span key={`empty-${index}`} />;
              const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const status = days[dateKey];
              return (
                <span
                  key={day}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-btn text-xs font-medium",
                    status ? STATUS_STYLES[status] : "text-gray-400",
                  )}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success" /> Keldi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" /> Kelmadi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Kechikdi
        </span>
      </div>
    </div>
  );
}
