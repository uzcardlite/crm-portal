import apiClient from "./client";

export function requestCode(phone) {
  return apiClient.post("/api/v1/portal/auth/request-code", { phone }).then((res) => res.data);
}

export function verifyCode(phone, code) {
  return apiClient
    .post("/api/v1/portal/auth/verify-code", { phone, code })
    .then((res) => res.data);
}

export function listStudents() {
  return apiClient.get("/api/v1/portal/students").then((res) => res.data);
}

export function getStudentSummary(studentId) {
  return apiClient.get(`/api/v1/portal/students/${studentId}/summary`).then((res) => res.data);
}

export function getStudentAttendance(studentId, year, month) {
  return apiClient
    .get(`/api/v1/portal/students/${studentId}/attendance`, { params: { year, month } })
    .then((res) => res.data);
}

export function getStudentPayments(studentId) {
  return apiClient.get(`/api/v1/portal/students/${studentId}/payments`).then((res) => res.data);
}

export function getStudentGrades(studentId) {
  return apiClient.get(`/api/v1/portal/students/${studentId}/grades`).then((res) => res.data);
}
