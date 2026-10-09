import { Component, Input } from '@angular/core';
import { BadgeTone } from '../domain/notification.model';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge badge--' + tone">{{ label }}</span>`,
})
export class BadgeComponent {
  @Input() label = '';
  @Input() tone: BadgeTone = 'info';
}
