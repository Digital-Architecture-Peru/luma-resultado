import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../atoms/badge.component';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="bell" role="status" [attr.aria-label]="'Notificaciones sin leer: ' + count">
      <span>Sin leer</span>
      <app-badge [label]="'' + count" [tone]="count > 0 ? 'danger' : 'neutral'" />
    </div>
  `,
})
export class NotificationBellComponent {
  @Input() count = 0;
}
