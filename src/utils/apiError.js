export function getErrorMessage(error, fallback = "Xatolik yuz berdi, qayta urinib ko'ring") {
  if (!error?.response) {
    return "Internet aloqasi yo'q yoki server javob bermayapti. Qayta urinib ko'ring.";
  }

  const { status, data } = error.response;

  if (status >= 500) {
    return "Serverda xatolik yuz berdi. Birozdan keyin qayta urinib ko'ring.";
  }

  const detail = data?.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === "string") return first;
    if (first?.msg) return first.msg;
  }

  return fallback;
}
