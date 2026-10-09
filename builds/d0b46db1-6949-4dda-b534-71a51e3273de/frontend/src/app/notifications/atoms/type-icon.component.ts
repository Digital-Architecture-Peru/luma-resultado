import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NotificationType } from '../data/notification.model';

const GLYPHS: Record<NotificationType, string> = {
  TRANSACTION: '💳',
  PAYMENT_DUE: '📅',
  LIMIT_REACHED: '⚠️',
  CARD_BLOCKED: '🔒',
};

export const TYPE_LABELS: Record<NotificationType, string> = {
  TRANSACTION: 'Movimiento',
  PAYMENT_DUE: 'Pago',
  LIMIT_REACHED: 'Límite',
  CARD_BLOCKED: 'Bloqueo',
};

/** Icono decorativo; el significado lo transmite el texto del badge contiguo. */
@Component({
  selector: 'app-type-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span aria-hidden="true">{{ glyph() }}</span>`,
})
export class TypeIconComponent {
  readonly type = input.required<NotificationType>();
  protected readonly glyph = computed(() => GLYPHS[this.type()]);
}
