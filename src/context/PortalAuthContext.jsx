import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { listPortalStudents } from "../api/portal";
import {
  clearPortalSession,
  getActiveStudentId,
  getPortalPhone,
  hasPortalSession,
  setActiveStudentId as persistActiveStudentId,
  setPortalPhone,
  setPortalTokens,
} from "../utils/portalTokenStorage";

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => hasPortalSession());
  const [students, setStudents] = useState([]);
  const [activeStudentId, setActiveStudentIdState] = useState(() => getActiveStudentId());
  const [phone, setPhoneState] = useState(() => getPortalPhone());
  const [loading, setLoading] = useState(() => hasPortalSession());
  const [error, setError] = useState(false);

  const loadStudents = useCallback(async () => {
    if (!hasPortalSession()) {
      setAuthenticated(false);
      setStudents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const list = await listPortalStudents();
      const saved = getActiveStudentId();
      // A stored id that is no longer in the list (child deactivated, other
      // parent's device) falls back to the first child.
      const next = list.some((student) => String(student.id) === saved)
        ? saved
        : list[0]
          ? String(list[0].id)
          : null;
      setStudents(list);
      setActiveStudentIdState(next);
      persistActiveStudentId(next);
      setAuthenticated(true);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        clearPortalSession();
        setAuthenticated(false);
        setStudents([]);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const login = useCallback(async (tokens, loginPhone) => {
    setPortalTokens(tokens);
    setPortalPhone(loginPhone);
    setPhoneState(loginPhone);
    setAuthenticated(true);
    await loadStudents();
  }, [loadStudents]);

  const selectStudent = useCallback((studentId) => {
    const next = studentId ? String(studentId) : null;
    setActiveStudentIdState(next);
    persistActiveStudentId(next);
  }, []);

  // Clears the portal keys only.
  const logout = useCallback(() => {
    clearPortalSession();
    setAuthenticated(false);
    setStudents([]);
    setActiveStudentIdState(null);
    setPhoneState(null);
    setLoading(false);
  }, []);

  const activeStudent =
    students.find((student) => String(student.id) === activeStudentId) ?? null;

  const value = {
    isAuthenticated: authenticated,
    students,
    activeStudentId,
    activeStudent,
    selectStudent,
    phone,
    loading,
    error,
    reloadStudents: loadStudents,
    login,
    logout,
  };

  return (
    <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const context = useContext(PortalAuthContext);
  if (!context) {
    throw new Error("usePortalAuth must be used within a PortalAuthProvider");
  }
  return context;
}
