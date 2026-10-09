import type { ReactNode } from 'react';

interface NotificationCenterTemplateProps {
  filter: ReactNode;
  notifications: ReactNode;
  preferences: ReactNode;
}

export function NotificationCenterTemplate({ filter, notifications, preferences }: NotificationCenterTemplateProps) {
  return (
    <div className="shell">
      <header className="shell__header">
        <h1>Notificaciones de tarjetas</h1>
        <p className="muted">Banca por Internet · datos de demostración</p>
      </header>
      <main className="shell__main">
        <div className="shell__column">
          {filter}
          {notifications}
        </div>
        <aside className="shell__column">{preferences}</aside>
      </main>
    </div>
  );
}
