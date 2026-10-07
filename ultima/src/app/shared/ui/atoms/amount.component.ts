import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-amount',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="amount">{{ formatted() }}</span>`,
  styles: `.amount { font-variant-numeric: tabular-nums; font-weight: 700; }`,
})
export class AmountComponent {
  readonly value = input.required<number>();
  readonly currency = input<string>(environment.currency);
  readonly locale = input<string>(environment.locale);

  readonly formatted = computed(() => {
    try {
      return new Intl.NumberFormat(this.locale(), {
        style: 'currency',
        currency: this.currency(),
      }).format(this.value());
    } catch {
      // Código de moneda o locale inválido: degradar sin romper la UI.
      return `${this.value().toFixed(2)} ${this.currency()}`;
    }
  });
}
