import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'success' | 'danger' | 'neutral';

/** Átomo: etiqueta de estado (texto + color, nunca solo color). */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge badge--' + tone()"><ng-content /></span>`,
})
export class StatusBadgeComponent {
  readonly tone = input<BadgeTone>('neutral');
}
