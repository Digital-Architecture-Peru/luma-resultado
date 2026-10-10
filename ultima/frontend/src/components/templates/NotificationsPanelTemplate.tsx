import type { ReactNode } from 'react';

interface NotificationsPanelTemplateProps {
  title: string;
  bell: ReactNode;
  children: ReactNode;
}

export function NotificationsPanelTemplate({ title, bell, children }: NotificationsPanelTemplateProps) {
  return (
    <main className="panel">
      <header className="panel__header">
        <h1>{title}</h1>
        {bell}
      </header>
      <section aria-label="Listado de notificaciones">{children}</section>
    </main>
  );
}
