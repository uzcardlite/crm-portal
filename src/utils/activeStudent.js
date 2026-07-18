const ACTIVE_STUDENT_KEY = "portal_active_student_id";

export function getActiveStudentId() {
  return localStorage.getItem(ACTIVE_STUDENT_KEY);
}

export function setActiveStudentId(id) {
  localStorage.setItem(ACTIVE_STUDENT_KEY, id);
}

export function clearActiveStudentId() {
  localStorage.removeItem(ACTIVE_STUDENT_KEY);
}
