import portalClient from "./portalClient";

// --- auth ------------------------------------------------------------------

export function requestPortalCode(phone) {
  return portalClient
    .post("/api/v1/portal/auth/request-code", { phone })
    .then((res) => res.data);
}

export function verifyPortalCode(phone, code) {
  return portalClient
    .post("/api/v1/portal/auth/verify-code", { phone, code })
    .then((res) => res.data);
}

// --- data ------------------------------------------------------------------

export function listPortalStudents() {
  return portalClient.get("/api/v1/portal/students").then((res) => res.data);
}

export function getPortalSummary(studentId) {
  return portalClient
    .get(`/api/v1/portal/students/${studentId}/summary`)
    .then((res) => res.data);
}

// `year` and `month` are required by the backend — omitting them returns 422.
export function getPortalAttendance(studentId, year, month) {
  return portalClient
    .get(`/api/v1/portal/students/${studentId}/attendance`, { params: { year, month } })
    .then((res) => res.data);
}

export function getPortalPayments(studentId) {
  return portalClient
    .get(`/api/v1/portal/students/${studentId}/payments`)
    .then((res) => res.data);
}

export function getPortalGrades(studentId) {
  return portalClient
    .get(`/api/v1/portal/students/${studentId}/grades`)
    .then((res) => res.data);
}

export function getPortalSchedule(studentId) {
  return portalClient
    .get(`/api/v1/portal/students/${studentId}/schedule`)
    .then((res) => res.data);
}
