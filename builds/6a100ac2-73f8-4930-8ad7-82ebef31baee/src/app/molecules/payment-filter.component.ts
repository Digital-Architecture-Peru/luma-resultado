import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PaymentFilter, STATUS_LABELS, StatusFilter } from '../domain/payment.model';

/** Molécula: controles de búsqueda y estado. Emite el filtro completo en cada cambio. */
@Component({
  selector: 'app-payment-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="filter" (submit)="$event.preventDefault()">
      <div class="field">
        <label for="search">Buscar</label>
        <input id="search" type="search" placeholder="Beneficiario, concepto o referencia"
          [value]="filter().text" (input)="onText($event)" />
      </div>
      <div class="field">
        <label for="status">Estado</label>
        <select id="status" [value]="filter().status" (change)="onStatus($event)">
          <option value="ALL">Todos</option>
          @for (option of options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>
      <button type="button" class="btn-secondary" (click)="filterChange.emit({ text: '', status: 'ALL' })">
        Limpiar filtros
      </button>
    </form>
  `,
})
export class PaymentFilterComponent {
  readonly filter = input.required<PaymentFilter>();
  readonly filterChange = output<PaymentFilter>();

  protected readonly options = (Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[]).map(
    (value) => ({ value, label: STATUS_LABELS[value] }),
  );

  protected onText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.filterChange.emit({ ...this.filter(), text });
  }

  protected onStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value as StatusFilter;
    this.filterChange.emit({ ...this.filter(), status });
  }
}
