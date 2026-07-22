import { useCallback, useMemo, useState } from "react";
import { Building2, IdCard, LogOut, Phone, UsersRound } from "lucide-react";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";
import EventRow from "../components/portal/EventRow";
import PortalErrorState from "../components/portal/PortalErrorState";
import SectionHeader from "../components/portal/SectionHeader";
import { getPortalSchedule } from "../api/portal";
import { usePortalAuth } from "../context/PortalAuthContext";
import { usePortalResource } from "../hooks/usePortalResource";
import { EMPTY_VALUE } from "../utils/format";
import { cn } from "../utils/cn";

export default function PortalProfile() {
  const { students, activeStudentId, activeStudent, selectStudent, phone, logout } =
    usePortalAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const enabled = Boolean(activeStudentId);
  const loadSchedule = useCallback(() => getPortalSchedule(activeStudentId), [activeStudentId]);
  const schedule = usePortalResource(loadSchedule, enabled);

  const items = useMemo(() => schedule.data ?? [], [schedule.data]);
  const groupNames = items.map((item) => item.group_name).join(", ");
  const teacherNames = [
    ...new Set(items.map((item) => item.teacher_name).filter(Boolean)),
  ].join(", ");

  const emptyValue = <span className="text-gray-400">{EMPTY_VALUE}</span>;

  return (
    <>
      <Card padding="p-4">
        <div className="flex items-center gap-3">
          <Avatar
            size="lg"
            photoUrl={activeStudent?.photo_url}
            name={activeStudent?.full_name}
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-gray-900">
              {activeStudent?.full_name}
            </p>
            {schedule.loading ? (
              <Skeleton className="mt-1 h-4 w-32" />
            ) : (
              <p className="truncate text-sm text-gray-500">{groupNames || EMPTY_VALUE}</p>
            )}
            <p className="truncate text-xs text-gray-400">{activeStudent?.tenant_name}</p>
          </div>
        </div>
      </Card>

      {students.length > 1 && (
        <Card padding="p-4">
          <div className="flex flex-col gap-3">
            <SectionHeader title="Farzandlar" count={students.length} />
            <div className="flex flex-col gap-2">
              {students.map((student) => {
                const isActive = String(student.id) === String(activeStudentId);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => selectStudent(student.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-center gap-3 rounded-card border border-gray-100 p-2 text-left transition-colors",
                      isActive && "ring-1 ring-accent",
                    )}
                  >
                    <Avatar size="sm" photoUrl={student.photo_url} name={student.full_name} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-gray-900">
                        {student.full_name}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {student.tenant_name}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      <Card padding="p-4">
        {schedule.error ? (
          <PortalErrorState onRetry={schedule.reload} />
        ) : (
          <div>
            <EventRow icon={Phone} title="Telefon" value={phone || emptyValue} />
            <EventRow
              icon={Building2}
              title="O'quv markaz"
              value={activeStudent?.tenant_name || emptyValue}
            />
            <EventRow
              icon={UsersRound}
              title="Guruh(lar)"
              value={schedule.loading ? <Skeleton className="h-4 w-20" /> : groupNames || emptyValue}
            />
            <EventRow
              icon={IdCard}
              title="O'qituvchi"
              value={
                schedule.loading ? <Skeleton className="h-4 w-20" /> : teacherNames || emptyValue
              }
            />
          </div>
        )}
      </Card>

      <Button variant="danger" className="w-full" onClick={() => setConfirmOpen(true)}>
        <LogOut size={16} />
        Chiqish
      </Button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Chiqish"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="danger" onClick={logout}>
              Chiqish
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-700">Kabinetdan chiqmoqchimisiz?</p>
      </Modal>
    </>
  );
}
