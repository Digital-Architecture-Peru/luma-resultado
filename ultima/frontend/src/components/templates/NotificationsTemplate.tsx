import type { ReactNode } from 'react';

interface NotificationsTemplateProps {
  title: string;
  toolbar: ReactNode;
  main: ReactNode;
  aside: ReactNode;
}

export default function NotificationsTemplate({ title, toolbar, main, aside }: NotificationsTemplateProps) {
  return (
    <div className="page">
      <header className="page__header">
        <h1>{title}</h1>
        <div className="toolbar">{toolbar}</div>
      </header>
      <div className="page__body">
        <main>{main}</main>
        <aside>{aside}</aside>
      </div>
    </div>
  );
}
