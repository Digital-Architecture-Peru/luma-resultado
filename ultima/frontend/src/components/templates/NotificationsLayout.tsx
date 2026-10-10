import type { ReactNode } from 'react';

interface NotificationsLayoutProps {
  title: string;
  bell: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
}

export function NotificationsLayout({ title, bell, toolbar, children }: NotificationsLayoutProps) {
  return (
    <main className="layout">
      <header className="layout__header">
        <h1>{title}</h1>
        {bell}
      </header>
      <div className="layout__toolbar">{toolbar}</div>
      <section aria-label="Listado de notificaciones">{children}</section>
    </main>
  );
}
