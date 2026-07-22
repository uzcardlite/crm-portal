import { Navigate, useLocation } from "react-router-dom";
import { usePortalAuth } from "../../context/PortalAuthContext";
import Spinner from "../ui/Spinner";

export default function PortalProtectedRoute({ children }) {
  const { isAuthenticated, loading } = usePortalAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
