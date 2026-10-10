import type { ReactNode } from 'react';

interface NotificationsTemplateProps {
  bell: ReactNode;
  filters: ReactNode;
  children: ReactNode;
}

export function NotificationsTemplate({ bell, filters, children }: NotificationsTemplateProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>Notificaciones de pagos</h1>
        {bell}
      </header>
      <nav className="layout__filters" aria-label="Filtro de notificaciones">
        {filters}
      </nav>
      <main>{children}</main>
    </div>
  );
}
