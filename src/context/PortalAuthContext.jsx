import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { listPortalStudents, loginWithTelegramInitData } from "../api/portal";
import {
  clearPortalSession,
  getActiveStudentId,
  getPortalPhone,
  hasPortalSession,
  setActiveStudentId as persistActiveStudentId,
  setPortalPhone,
  setPortalTokens,
} from "../utils/portalTokenStorage";
import { getTelegramInitData, isTelegramMiniApp, setupTelegramWebApp } from "../utils/telegram";

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => hasPortalSession());
  const [students, setStudents] = useState([]);
  const [activeStudentId, setActiveStudentIdState] = useState(() => getActiveStudentId());
  const [phone, setPhoneState] = useState(() => getPortalPhone());
  // Also true (not just when a session already exists) so a Mini App
  // auto-login attempt can run before the login form ever gets a chance to
  // flash on screen.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Message from a failed Telegram auto-login (e.g. "not registered yet"),
  // read and cleared once by the login screen.
  const [telegramAuthError, setTelegramAuthError] = useState(null);
  const clearTelegramAuthError = useCallback(() => setTelegramAuthError(null), []);

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

  // Attempts a silent Telegram Mini App login before falling back to the
  // regular phone + code flow. Runs once on mount.
  const attemptTelegramAutoLogin = useCallback(async () => {
    try {
      const tokens = await loginWithTelegramInitData(getTelegramInitData());
      setPortalTokens(tokens);
      setAuthenticated(true);
      await loadStudents();
    } catch (requestError) {
      const status = requestError?.response?.status;
      const detail = requestError?.response?.data?.detail;
      if ((status === 404 || status === 401) && typeof detail === "string") {
        setTelegramAuthError(detail);
      }
      setAuthenticated(false);
      setLoading(false);
    }
  }, [loadStudents]);

  useEffect(() => {
    setupTelegramWebApp();

    if (hasPortalSession()) {
      loadStudents();
    } else if (isTelegramMiniApp()) {
      setLoading(true);
      attemptTelegramAutoLogin();
    } else {
      setLoading(false);
    }
    // Runs once on mount — the Mini App state does not change during a session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    telegramAuthError,
    clearTelegramAuthError,
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
