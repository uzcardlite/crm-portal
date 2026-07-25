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

// Auto-login when the portal is opened as a Telegram Mini App. Returns the
// same { access_token, refresh_token } shape as verify-code.
export function loginWithTelegramInitData(initData) {
  return portalClient
    .post("/api/v1/portal/auth/telegram", { init_data: initData })
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

// --- menu ------------------------------------------------------------------

// `range` is "today" (default) or "week"; both are keyed off the server's
// today, so no date is sent from the client.
export function getPortalMenu(studentId, range = "week") {
  return portalClient
    .get("/api/v1/portal/menu", { params: { student_id: studentId, range } })
    .then((res) => res.data);
}

// --- turnstile -------------------------------------------------------------

export function getPortalTurnstile(studentId) {
  return portalClient
    .get("/api/v1/portal/turnstile", { params: { student_id: studentId } })
    .then((res) => res.data);
}

// --- chat ------------------------------------------------------------------

// Threads are opened by a teacher; a parent can only read/reply. The list is
// scoped to one child on the server via `student_id`.
export function getPortalChatThreads(studentId) {
  return portalClient
    .get("/api/v1/portal/chat/threads", { params: { student_id: studentId } })
    .then((res) => res.data);
}

export function getPortalChatMessages(threadId) {
  return portalClient
    .get(`/api/v1/portal/chat/threads/${threadId}/messages`)
    .then((res) => res.data);
}

export function sendPortalChatMessage(threadId, body) {
  return portalClient
    .post(`/api/v1/portal/chat/threads/${threadId}/messages`, { body })
    .then((res) => res.data);
}

// Clears the teacher's unread messages in this thread (never the parent's own).
export function markPortalChatRead(threadId) {
  return portalClient
    .post(`/api/v1/portal/chat/threads/${threadId}/read`)
    .then((res) => res.data);
}

// Teachers the parent can start a chat with for this child — the teachers of
// the child's active groups. Each item: { teacher_id, teacher_name, group_id,
// group_name }.
export function getPortalChatTeachers(studentId) {
  return portalClient
    .get("/api/v1/portal/chat/teachers", { params: { student_id: studentId } })
    .then((res) => res.data);
}

// Opens (or returns, idempotently) a thread between this child and a teacher.
// Returns the same ChatThreadOut shape as the thread list, so callers can
// navigate straight to `/chat/{id}`.
export function createPortalChatThread(studentId, teacherId) {
  return portalClient
    .post("/api/v1/portal/chat/threads", {
      student_id: studentId,
      teacher_id: teacherId,
    })
    .then((res) => res.data);
}

// --- booking ---------------------------------------------------------------

export function getPortalBookingSlots(studentId) {
  return portalClient
    .get("/api/v1/portal/booking/slots", { params: { student_id: studentId } })
    .then((res) => res.data);
}

export function getPortalBookings(studentId) {
  return portalClient
    .get("/api/v1/portal/booking/bookings", { params: { student_id: studentId } })
    .then((res) => res.data);
}

// parent_phone is taken from the JWT on the server — never sent in the body.
export function createPortalBooking(slotId, studentId, note) {
  return portalClient
    .post("/api/v1/portal/booking/bookings", {
      slot_id: slotId,
      student_id: studentId,
      note: note || null,
    })
    .then((res) => res.data);
}

export function cancelPortalBooking(bookingId) {
  return portalClient
    .post(`/api/v1/portal/booking/bookings/${bookingId}/cancel`)
    .then((res) => res.data);
}
