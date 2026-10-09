import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PaymentMode } from '../domain/models';

/** Molécula: elección del tipo de pago y monto personalizado. */
@Component({
  selector: 'app-amount-options',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="field-group">
      <legend>Monto a pagar</legend>
      @for (option of options; track option.value) {
        <label class="radio">
          <input
            type="radio"
            name="mode"
            [value]="option.value"
            [checked]="mode() === option.value"
            (change)="modeChange.emit(option.value)"
          />
          {{ option.label }}
        </label>
      }
      @if (mode() === 'custom') {
        <label class="field">
          <span>Otro monto (USD)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            [value]="custom() ?? ''"
            (input)="onCustom($event)"
          />
        </label>
      }
    </fieldset>
  `,
})
export class AmountOptionsComponent {
  readonly mode = input.required<PaymentMode>();
  readonly custom = input<number | null>(null);
  readonly modeChange = output<PaymentMode>();
  readonly customChange = output<number | null>();

  protected readonly options: ReadonlyArray<{ value: PaymentMode; label: string }> = [
    { value: 'minimum', label: 'Pago mínimo' },
    { value: 'total', label: 'Pago total' },
    { value: 'custom', label: 'Otro monto' },
  ];

  protected onCustom(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.customChange.emit(raw === '' ? null : Number(raw));
  }
}
