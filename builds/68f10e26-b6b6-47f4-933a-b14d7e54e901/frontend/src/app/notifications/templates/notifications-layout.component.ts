import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notifications-layout',
  standalone: true,
  template: `
    <header class="header">
      <h1>Notificaciones de pagos</h1>
      <span class="count" [attr.aria-label]="unreadCount + ' notificaciones sin leer'">{{ unreadCount }} sin leer</span>
    </header>
    <main class="content"><ng-content /></main>
  `,
  styles: [
    `:host{display:block;max-inline-size:48rem;margin-inline:auto;padding:clamp(1rem,4vw,2rem)}
     .header{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-block-end:var(--space)}
     h1{margin:0;font-size:clamp(1.25rem,3vw,1.75rem)}
     .count{padding:.25rem .75rem;border-radius:999px;background:var(--primary);color:var(--primary-contrast);font-weight:600}`,
  ],
})
export class NotificationsLayoutComponent {
  @Input() unreadCount = 0;
}
