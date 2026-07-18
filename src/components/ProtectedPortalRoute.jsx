import { Navigate, useLocation } from "react-router-dom";
import { usePortalAuth } from "../context/PortalAuthContext";
import Spinner from "./ui/Spinner";

export default function ProtectedPortalRoute({ children }) {
  const { authenticated, loading, activeStudentId, students } = usePortalAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size={32} />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!activeStudentId && students.length > 0 && location.pathname !== "/select-child") {
    return <Navigate to="/select-child" replace />;
  }

  return children;
}
