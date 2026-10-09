import { Component, Input } from '@angular/core';

export type TonoBadge = 'ok' | 'warn' | 'off';

/** Átomo: etiqueta de estado. El texto siempre acompaña al color. */
@Component({
  selector: 'app-badge',
  standalone: true,
  template: '<span [class]="clase">{{ texto }}</span>',
})
export class BadgeComponent {
  @Input() texto = '';
  @Input() tono: TonoBadge = 'off';

  get clase(): string {
    return `badge badge--${this.tono}`;
  }
}
