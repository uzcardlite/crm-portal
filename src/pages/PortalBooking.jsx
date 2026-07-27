import { useCallback, useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";
import { toast } from "../components/ui/Toast";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import SectionHeader from "../components/portal/SectionHeader";
import {
  cancelPortalBooking,
  createPortalBooking,
  getPortalBookings,
  getPortalBookingSlots,
} from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { BOOKING_STATUS } from "../constants/portal";
import { getErrorMessage } from "../utils/apiError";
import { formatClock, formatDate } from "../utils/format";

function slotRange(item) {
  return `${formatClock(item.start_time)} – ${formatClock(item.end_time)}`;
}

export default function PortalBooking() {
  const { activeStudentId, activeStudent } = usePortalAuth();
  const enabled = Boolean(activeStudentId);

  const loadSlots = useCallback(() => getPortalBookingSlots(activeStudentId), [activeStudentId]);
  const loadBookings = useCallback(() => getPortalBookings(activeStudentId), [activeStudentId]);
  const slots = usePortalResource(loadSlots, enabled);
  const bookings = usePortalResource(loadBookings, enabled);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const availableSlots = useMemo(() => slots.data ?? [], [slots.data]);
  const myBookings = useMemo(() => bookings.data ?? [], [bookings.data]);

  const openBooking = (slot) => {
    setSelectedSlot(slot);
    setNote("");
  };

  const confirmBooking = () => {
    if (!selectedSlot || submitting) return;
    setSubmitting(true);
    createPortalBooking(selectedSlot.id, activeStudentId, note)
      .then(() => {
        toast.success("Konsultatsiya band qilindi");
        setSelectedSlot(null);
        slots.reload();
        bookings.reload();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSubmitting(false));
  };

  const handleCancel = (bookingId) => {
    setCancellingId(bookingId);
    cancelPortalBooking(bookingId)
      .then(() => {
        toast.success("Bandlov bekor qilindi");
        bookings.reload();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setCancellingId(null));
  };

  return (
    <>
      <PortalPageHeader title="Konsultatsiya" subtitle={activeStudent?.full_name} />

      {/* My bookings */}
      <Card padding="p-4">
        <div className="flex flex-col gap-3">
          <SectionHeader title="Mening bandlovlarim" count={myBookings.length} />
          {bookings.loading ? (
            <>
              {Array.from({ length: 2 }, (_, index) => (
                <Skeleton key={index} className="h-14 rounded-card" />
              ))}
            </>
          ) : bookings.error ? (
            <PortalErrorState onRetry={bookings.reload} />
          ) : myBookings.length === 0 ? (
            <EmptyState size="sm" icon={CalendarClock} title="Bandlov yo'q" />
          ) : (
            <div>
              {myBookings.map((booking) => {
                const status = BOOKING_STATUS[booking.status] ?? BOOKING_STATUS.pending;
                const canCancel = booking.status !== "cancelled";
                return (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 border-b border-line py-3 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-fg">
                        {formatDate(booking.date)}
                      </p>
                      <p className="mt-0.5 text-xs text-fg-muted">{slotRange(booking)}</p>
                      {booking.note && (
                        <p className="mt-0.5 truncate text-xs text-fg-faint">{booking.note}</p>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {canCancel && (
                        <button
                          type="button"
                          disabled={cancellingId === booking.id}
                          onClick={() => handleCancel(booking.id)}
                          className="text-xs font-medium text-danger disabled:opacity-50"
                        >
                          Bekor qilish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Available slots */}
      <Card padding="p-4">
        <div className="flex flex-col gap-3">
          <SectionHeader title="Bo'sh vaqtlar" count={availableSlots.length} />
          {slots.loading ? (
            <>
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-14 rounded-card" />
              ))}
            </>
          ) : slots.error ? (
            <PortalErrorState onRetry={slots.reload} />
          ) : availableSlots.length === 0 ? (
            <EmptyState
              size="sm"
              icon={CalendarClock}
              title="Bo'sh vaqt yo'q"
              description="O'qituvchi vaqt ochganda shu yerda ko'rinadi."
            />
          ) : (
            <div>
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center gap-3 border-b border-line py-3 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-fg">{formatDate(slot.date)}</p>
                    <p className="mt-0.5 text-xs text-fg-muted">{slotRange(slot)}</p>
                  </div>
                  <Button size="sm" onClick={() => openBooking(slot)}>
                    Band qilish
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={Boolean(selectedSlot)}
        onClose={() => setSelectedSlot(null)}
        title="Konsultatsiyani band qilish"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedSlot(null)} disabled={submitting}>
              Bekor qilish
            </Button>
            <Button onClick={confirmBooking} disabled={submitting}>
              Tasdiqlash
            </Button>
          </>
        }
      >
        {selectedSlot && (
          <div className="flex flex-col gap-3">
            <div className="rounded-card bg-accent-light/20 px-4 py-3">
              <p className="text-sm font-medium text-fg">{formatDate(selectedSlot.date)}</p>
              <p className="mt-0.5 text-sm text-fg-secondary">{slotRange(selectedSlot)}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="booking-note" className="text-sm font-medium text-fg-secondary">
                Izoh (ixtiyoriy)
              </label>
              <textarea
                id="booking-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="Muhokama qilmoqchi bo'lgan mavzu..."
                className="resize-none rounded-btn border border-line-strong bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
