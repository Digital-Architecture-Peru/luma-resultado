import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Átomo: etiqueta de estado (texto + color, nunca solo color). */
@Component({
  selector: 'ui-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="'badge badge-' + tone()"><ng-content /></span>`,
})
export class UiBadgeComponent {
  readonly tone = input<'neutral' | 'success' | 'danger'>('neutral');
}
