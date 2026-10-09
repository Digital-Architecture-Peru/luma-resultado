import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Severity } from '../../domain/notification.model';

/** Átomo: etiqueta de estado (texto + color, nunca solo color). */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge badge--' + severity()">{{ label() }}</span>`
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly severity = input<Severity>('info');
}
