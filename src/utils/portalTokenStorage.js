// Portal (parent/student cabinet) session storage.
const ACCESS_TOKEN_KEY = "crm_portal_access_token";
const REFRESH_TOKEN_KEY = "crm_portal_refresh_token";
const PHONE_KEY = "crm_portal_phone";
const ACTIVE_STUDENT_KEY = "crm_portal_active_student";

export function getPortalAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getPortalRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setPortalTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export function getPortalPhone() {
  return localStorage.getItem(PHONE_KEY);
}

export function setPortalPhone(phone) {
  if (phone) localStorage.setItem(PHONE_KEY, phone);
}

export function getActiveStudentId() {
  return localStorage.getItem(ACTIVE_STUDENT_KEY);
}

export function setActiveStudentId(studentId) {
  if (studentId) {
    localStorage.setItem(ACTIVE_STUDENT_KEY, String(studentId));
  } else {
    localStorage.removeItem(ACTIVE_STUDENT_KEY);
  }
}

export function hasPortalSession() {
  return Boolean(getPortalAccessToken() || getPortalRefreshToken());
}

// Clears ONLY the portal keys.
export function clearPortalSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(PHONE_KEY);
  localStorage.removeItem(ACTIVE_STUDENT_KEY);
}
