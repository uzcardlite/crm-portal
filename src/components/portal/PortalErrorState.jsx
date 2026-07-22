import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

// Failed request inside a card slot: the toast already told the user what went
// wrong, this gives them the way back.
export default function PortalErrorState({
  title = "Ma'lumotni yuklab bo'lmadi",
  description = "Internet aloqasini tekshirib, qayta urinib ko'ring.",
  onRetry,
  size = "sm",
}) {
  return (
    <EmptyState
      size={size}
      icon={AlertTriangle}
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button size="sm" variant="secondary" onClick={onRetry}>
            Qayta urinish
          </Button>
        ) : null
      }
    />
  );
}
