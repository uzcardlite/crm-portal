import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PortalAuthProvider } from "./context/PortalAuthContext";
import ProtectedPortalRoute from "./components/ProtectedPortalRoute";
import PortalLayout from "./components/PortalLayout";
import Toast from "./components/ui/Toast";
import Login from "./pages/Login";
import SelectChild from "./pages/SelectChild";
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import Grades from "./pages/Grades";

export default function App() {
  return (
    <PortalAuthProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/select-child"
            element={
              <ProtectedPortalRoute>
                <SelectChild />
              </ProtectedPortalRoute>
            }
          />
          <Route
            element={
              <ProtectedPortalRoute>
                <PortalLayout />
              </ProtectedPortalRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/grades" element={<Grades />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PortalAuthProvider>
  );
}
