import { Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning';

/** Átomo: etiqueta de estado (texto siempre presente, no solo color). */
@Component({
  selector: 'app-badge',
  template: `<span class="badge" [attr.data-tone]="tone()">{{ label() }}</span>`,
})
export class BadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<BadgeTone>('neutral');
}
