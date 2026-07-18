import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { listStudents, verifyCode as verifyCodeRequest } from "../api/portal";
import {
  clearActiveStudentId,
  getActiveStudentId,
  setActiveStudentId as persistActiveStudentId,
} from "../utils/activeStudent";
import { clearTokens, getAccessToken, setTokens } from "../utils/tokenStorage";

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [activeStudentId, setActiveStudentIdState] = useState(getActiveStudentId());
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(Boolean(getAccessToken()));

  const loadStudents = useCallback(async () => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    try {
      const data = await listStudents();
      setStudents(data);
      setAuthenticated(true);
    } catch {
      clearTokens();
      clearActiveStudentId();
      setAuthenticated(false);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const login = useCallback(
    async (phone, code) => {
      const tokens = await verifyCodeRequest(phone, code);
      setTokens(tokens);
      setAuthenticated(true);
      await loadStudents();
    },
    [loadStudents],
  );

  const logout = useCallback(() => {
    clearTokens();
    clearActiveStudentId();
    setAuthenticated(false);
    setStudents([]);
    setActiveStudentIdState(null);
  }, []);

  const selectStudent = useCallback((id) => {
    persistActiveStudentId(id);
    setActiveStudentIdState(id);
  }, []);

  const activeStudent = students.find((s) => s.id === activeStudentId) || null;

  const value = {
    students,
    loading,
    authenticated,
    activeStudentId,
    activeStudent,
    login,
    logout,
    selectStudent,
    refreshStudents: loadStudents,
  };

  return <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>;
}

export function usePortalAuth() {
  const context = useContext(PortalAuthContext);
  if (!context) {
    throw new Error("usePortalAuth must be used within a PortalAuthProvider");
  }
  return context;
}
