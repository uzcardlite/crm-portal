import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PortalAuthProvider } from "./context/PortalAuthContext";
import PortalProtectedRoute from "./components/portal/PortalProtectedRoute";
import PortalLayout from "./components/portal/PortalLayout";
import Toast from "./components/ui/Toast";
import PortalLogin from "./pages/PortalLogin";
import PortalHome from "./pages/PortalHome";
import PortalAttendance from "./pages/PortalAttendance";
import PortalGrades from "./pages/PortalGrades";
import PortalPayments from "./pages/PortalPayments";
import PortalSchedule from "./pages/PortalSchedule";
import PortalProfile from "./pages/PortalProfile";

export default function App() {
  return (
    <PortalAuthProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/login" element={<PortalLogin />} />
          <Route
            element={
              <PortalProtectedRoute>
                <PortalLayout />
              </PortalProtectedRoute>
            }
          >
            <Route path="/" element={<PortalHome />} />
            <Route path="/attendance" element={<PortalAttendance />} />
            <Route path="/grades" element={<PortalGrades />} />
            <Route path="/payments" element={<PortalPayments />} />
            <Route path="/schedule" element={<PortalSchedule />} />
            <Route path="/profile" element={<PortalProfile />} />
          </Route>
          {/* Unknown path stays inside the portal instead of a 404. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PortalAuthProvider>
  );
}
