import type { NotificationsApi } from "../api/types";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationBell } from "../organisms/NotificationBell";
import { BankLayout } from "../templates/BankLayout";

export function PaymentsPage({ api }: { api: NotificationsApi }) {
  const { items, unreadCount, status, markRead } = useNotifications(api);

  return (
    <BankLayout
      headerActions={
        <NotificationBell items={items} unreadCount={unreadCount} status={status} onMarkRead={markRead} />
      }
    >
      <h2>Pagos</h2>
      <p>
        Aquí verás el resumen de tus pagos. Las notificaciones de pagos aparecen en la campana y se actualizan cada
        30 segundos.
      </p>
    </BankLayout>
  );
}
