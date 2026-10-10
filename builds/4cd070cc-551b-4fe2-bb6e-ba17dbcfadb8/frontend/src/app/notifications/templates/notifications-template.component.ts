import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../atoms/badge.component';

@Component({
  selector: 'app-notifications-template',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <main class="layout">
      <header>
        <h1>Notificaciones de la cuenta <app-badge [count]="unread" /></h1>
        <ng-content select="[actions]" />
      </header>
      <ng-content />
    </main>
  `,
  styles: [
    `.layout { max-width: 48rem; margin-inline: auto; padding: var(--space-4); }
     header { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap; }`
  ]
})
export class NotificationsTemplateComponent {
  @Input() unread = 0;
}
