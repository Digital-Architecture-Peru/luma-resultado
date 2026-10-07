import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CURRENCY_CODE } from '../../tokens';

@Component({
  selector: 'app-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="amount" [class.negative]="value() < 0">{{ formatted() }}</span>`,
  styles: `
    .amount { font-variant-numeric: tabular-nums; white-space: nowrap; }
    .negative { color: var(--danger); }
  `,
})
export class Amount {
  readonly value = input.required<number>();
  readonly currency = input<string | undefined>(undefined);

  private readonly defaultCurrency = inject(CURRENCY_CODE);

  protected readonly formatted = computed(() =>
    new Intl.NumberFormat('es', {
      style: 'currency',
      currency: this.currency() ?? this.defaultCurrency,
    }).format(this.value()),
  );
}
