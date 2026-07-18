import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import { usePortalAuth } from "../context/PortalAuthContext";

export default function SelectChild() {
  const navigate = useNavigate();
  const { students, activeStudentId, selectStudent } = usePortalAuth();

  useEffect(() => {
    if (students.length === 1 && !activeStudentId) {
      selectStudent(students[0].id);
      navigate("/", { replace: true });
    }
  }, [students, activeStudentId, selectStudent, navigate]);

  function handleSelect(id) {
    selectStudent(id);
    navigate("/", { replace: true });
  }

  if (students.length <= 1) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-sm">
        <h1 className="mb-1 text-lg font-semibold text-gray-900">Farzandni tanlang</h1>
        <p className="mb-6 text-sm text-gray-500">Siz bir nechta talabaga bog'langansiz</p>

        <div className="flex flex-col gap-3">
          {students.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => handleSelect(student.id)}
              className="flex items-center gap-3 rounded-card border border-gray-100 bg-white p-4 text-left shadow-card transition-shadow hover:shadow-md"
            >
              {student.photo_url ? (
                <img
                  src={student.photo_url}
                  alt={student.full_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-light/30 text-accent-dark">
                  <UserRound size={22} />
                </span>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{student.full_name}</p>
                <p className="text-xs text-gray-500">{student.tenant_name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
