import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Pencil, Users } from "lucide-react";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";
import Spinner from "../components/ui/Spinner";
import { toast } from "../components/ui/Toast";
import PortalErrorState from "../components/portal/PortalErrorState";
import PortalPageHeader from "../components/portal/PortalPageHeader";
import { createPortalChatThread, getPortalChatTeachers, getPortalChatThreads } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { getErrorMessage } from "../utils/apiError";
import { formatDate, formatTime } from "../utils/format";

// Same-day threads show a time; older ones show the date.
function threadStamp(value) {
  if (!value) return "";
  const isToday = String(value).slice(0, 10) === new Date().toISOString().slice(0, 10);
  return isToday ? formatTime(value) : formatDate(value);
}

export default function PortalChat() {
  const navigate = useNavigate();
  const { activeStudentId, activeStudent } = usePortalAuth();

  const enabled = Boolean(activeStudentId);
  const loadThreads = useCallback(() => getPortalChatThreads(activeStudentId), [activeStudentId]);
  const chat = usePortalResource(loadThreads, enabled);

  const threads = useMemo(() => chat.data ?? [], [chat.data]);

  // Teacher-picker state for the "Ustozga yozish" flow.
  const [pickerOpen, setPickerOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [teachersError, setTeachersError] = useState(false);
  // teacher_id currently being opened — disables the row and shows a spinner.
  const [openingId, setOpeningId] = useState(null);

  const loadTeachers = useCallback(() => {
    if (!activeStudentId) return;
    setTeachersLoading(true);
    setTeachersError(false);
    getPortalChatTeachers(activeStudentId)
      .then((rows) => setTeachers(Array.isArray(rows) ? rows : []))
      .catch(() => setTeachersError(true))
      .finally(() => setTeachersLoading(false));
  }, [activeStudentId]);

  const openPicker = useCallback(() => {
    setPickerOpen(true);
    loadTeachers();
  }, [loadTeachers]);

  // Re-fetch teachers if the child is switched while the picker is closed.
  useEffect(() => {
    if (!pickerOpen) {
      setTeachers([]);
      setTeachersError(false);
    }
  }, [activeStudentId, pickerOpen]);

  const startThread = useCallback(
    (teacher) => {
      if (openingId) return;
      setOpeningId(teacher.teacher_id);
      createPortalChatThread(activeStudentId, teacher.teacher_id)
        .then((thread) => {
          setPickerOpen(false);
          navigate(`/chat/${thread.id}`);
        })
        .catch((requestError) => {
          toast.error(getErrorMessage(requestError));
        })
        .finally(() => setOpeningId(null));
    },
    [activeStudentId, navigate, openingId],
  );

  return (
    <>
      <PortalPageHeader title="Chat" subtitle={activeStudent?.full_name}>
        {enabled && threads.length > 0 && (
          <Button size="sm" onClick={openPicker} className="flex-shrink-0">
            <Pencil size={16} />
            Ustozga yozish
          </Button>
        )}
      </PortalPageHeader>

      {chat.loading ? (
        <Card padding="p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="mt-2 h-14" />
          ))}
        </Card>
      ) : chat.error ? (
        <PortalErrorState onRetry={chat.reload} />
      ) : threads.length === 0 ? (
        <EmptyState
          size="md"
          icon={MessageCircle}
          title="Suhbatlar yo'q"
          description="Ustozga yozib, birinchi suhbatni boshlang."
          action={
            <Button size="sm" onClick={openPicker} disabled={!enabled}>
              <Pencil size={16} />
              Ustozga yozish
            </Button>
          }
        />
      ) : (
        <Card padding="p-2">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              to={`/chat/${thread.id}`}
              className="flex items-center gap-3 rounded-btn px-2 py-3 transition-colors active:bg-gray-100"
            >
              <Avatar
                size="md"
                photoUrl={thread.photo_url}
                name={thread.student_full_name}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {thread.group_name || thread.student_full_name}
                  </p>
                  <span className="flex-shrink-0 text-xs text-gray-400">
                    {threadStamp(thread.last_message_at)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-gray-500">
                    {thread.last_message_body || "Xabar yo'q"}
                  </p>
                  {thread.unread_count > 0 && (
                    <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-dark">
                      {thread.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </Card>
      )}

      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Ustozga yozish">
        {teachersLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-14" />
            ))}
          </div>
        ) : teachersError ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-gray-500">Ustozlarni yuklab bo'lmadi.</p>
            <Button size="sm" variant="secondary" onClick={loadTeachers}>
              Qayta urinish
            </Button>
          </div>
        ) : teachers.length === 0 ? (
          <EmptyState
            size="sm"
            icon={Users}
            title="Guruh yoki ustoz topilmadi"
            description="O'quvchi aktiv guruhga biriktirilgach, ustozlar shu yerda ko'rinadi."
          />
        ) : (
          <div className="flex flex-col gap-1">
            {teachers.map((teacher) => {
              const opening = openingId === teacher.teacher_id;
              return (
                <button
                  key={`${teacher.teacher_id}-${teacher.group_id}`}
                  type="button"
                  onClick={() => startThread(teacher)}
                  disabled={Boolean(openingId)}
                  className="flex items-center gap-3 rounded-btn px-2 py-3 text-left transition-colors active:bg-gray-100 disabled:opacity-60"
                >
                  <Avatar size="md" name={teacher.teacher_name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {teacher.teacher_name}
                    </p>
                    {teacher.group_name && (
                      <p className="truncate text-xs text-gray-500">{teacher.group_name}</p>
                    )}
                  </div>
                  {opening && <Spinner size={18} className="flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </Modal>
    </>
  );
}
