import { useMemo, useState } from "react";
import { toMessage, type NotificationsApi } from "../api/notificationsClient";
import { Toggle } from "../components/atoms/Toggle";
import { Pager } from "../components/molecules/Pager";
import { NotificationList } from "../components/organisms/NotificationList";
import { PreferencesPanel } from "../components/organisms/PreferencesPanel";
import { CardNotificationsLayout } from "../components/templates/CardNotificationsLayout";
import type { CardOption } from "../config";
import { useNotificationList, usePreferences, type RemoteState } from "../hooks/useCardNotifications";
import type { CardNotification } from "../api/types";

interface CardNotificationsPageProps {
  api: NotificationsApi;
  cards: readonly CardOption[];
  pageSize?: number;
}

export function CardNotificationsPage({ api, cards, pageSize = 10 }: CardNotificationsPageProps) {
  if (cards.length === 0) {
    return <p className="state state--empty">No tienes tarjetas para mostrar notificaciones.</p>;
  }
  return <NotificationsContent api={api} cards={cards} pageSize={pageSize} />;
}

function NotificationsContent({ api, cards, pageSize }: Required<CardNotificationsPageProps>) {
  const [cardId, setCardId] = useState(cards[0].id);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const list = useNotificationList(api, cardId, unreadOnly, pageIndex, pageSize);
  const preferences = usePreferences(api, cardId);

  const items: RemoteState<CardNotification[]> = useMemo(
    () => (list.state.status === "success" ? { status: "success", data: list.state.data.items } : list.state),
    [list.state],
  );
  const total = list.state.status === "success" ? list.state.data.total : 0;

  const handleMarkRead = async (id: string) => {
    setPendingId(id);
    setActionError(null);
    try {
      list.replaceItem(await api.markAsRead(id));
      if (unreadOnly) list.reload();
    } catch (error: unknown) {
      setActionError(toMessage(error));
    } finally {
      setPendingId(null);
    }
  };

  const filters = (
    <>
      <div className="field">
        <label htmlFor="card-select">Tarjeta</label>
        <select
          id="card-select"
          value={cardId}
          onChange={(event) => {
            setCardId(event.target.value);
            setPageIndex(0);
          }}
        >
          {cards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.label} · terminada en {card.last4}
            </option>
          ))}
        </select>
      </div>
      <Toggle
        id="unread-only"
        label="Solo no leídas"
        checked={unreadOnly}
        onChange={(checked) => {
          setUnreadOnly(checked);
          setPageIndex(0);
        }}
      />
    </>
  );

  const main = (
    <>
      {actionError !== null && <p role="alert" className="state state--error">{actionError}</p>}
      <NotificationList
        items={items}
        pendingId={pendingId}
        emptyMessage={unreadOnly ? "No tienes notificaciones sin leer." : "No tienes notificaciones."}
        onMarkRead={handleMarkRead}
        onRetry={list.reload}
      />
      <Pager page={pageIndex} pageSize={pageSize} total={total} onChange={setPageIndex} />
    </>
  );

  const aside = (
    <PreferencesPanel
      preferences={preferences.state}
      saving={preferences.saving}
      saveError={preferences.saveError}
      onToggle={preferences.toggle}
    />
  );

  return <CardNotificationsLayout title="Notificaciones de tarjetas" filters={filters} main={main} aside={aside} />;
}
