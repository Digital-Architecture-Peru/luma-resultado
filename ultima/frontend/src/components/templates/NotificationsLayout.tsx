import type { ReactNode } from "react";

interface NotificationsLayoutProps {
  title: string;
  toolbar: ReactNode;
  main: ReactNode;
  aside: ReactNode;
}

export function NotificationsLayout({ title, toolbar, main, aside }: NotificationsLayoutProps) {
  return (
    <div className="layout">
      <header>
        <h1>{title}</h1>
        {toolbar}
      </header>
      <main className="layout__grid">
        <section aria-labelledby="list-title">
          <h2 id="list-title">Notificaciones</h2>
          {main}
        </section>
        <aside aria-labelledby="prefs-title">
          <h2 id="prefs-title">Preferencias</h2>
          {aside}
        </aside>
      </main>
    </div>
  );
}
