import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { getStudentGrades } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { toast } from "../components/ui/Toast";
import { getErrorMessage } from "../utils/apiError";

export default function Grades() {
  const { activeStudentId } = usePortalAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeStudentId) return;
    setLoading(true);
    getStudentGrades(activeStudentId)
      .then(setGrades)
      .catch((error) => toast.error(getErrorMessage(error, "Baholarni yuklab bo'lmadi")))
      .finally(() => setLoading(false));
  }, [activeStudentId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <div className="p-4">
        <EmptyState icon={GraduationCap} title="Hali ma'lumot yo'q" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {grades.map((grade) => (
        <Card key={grade.exam_id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">{grade.exam_name}</p>
            <p className="text-xs text-gray-500">
              {grade.group_name} • {new Date(grade.date).toLocaleDateString("uz-UZ")}
            </p>
          </div>
          <span className="text-sm font-semibold text-accent-dark">
            {grade.score}/{grade.max_score}
          </span>
        </Card>
      ))}
    </div>
  );
}
