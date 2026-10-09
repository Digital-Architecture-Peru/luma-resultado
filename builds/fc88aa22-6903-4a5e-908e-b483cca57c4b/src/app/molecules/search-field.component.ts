import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountTypeFilter } from '../core/account.model';

interface TypeOption {
  readonly value: AccountTypeFilter;
  readonly label: string;
}

/** Molécula: búsqueda por texto + filtro por tipo. Emite cambios, no conoce los datos. */
@Component({
  selector: 'app-search-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search">
      <label for="acc-query">Buscar cuenta</label>
      <input
        id="acc-query"
        type="search"
        placeholder="Alias o últimos dígitos"
        [value]="query"
        (input)="onQuery($event)"
      />
      <label for="acc-type">Tipo</label>
      <select id="acc-type" [value]="type" (change)="onType($event)">
        @for (option of options; track option.value) {
          <option [value]="option.value" [selected]="option.value === type">{{ option.label }}</option>
        }
      </select>
    </div>
  `,
})
export class SearchFieldComponent {
  @Input() query = '';
  @Input() type: AccountTypeFilter = 'TODAS';
  @Output() queryChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<AccountTypeFilter>();

  readonly options: readonly TypeOption[] = [
    { value: 'TODAS', label: 'Todas' },
    { value: 'AHORROS', label: 'Ahorros' },
    { value: 'CORRIENTE', label: 'Corriente' },
    { value: 'PLAZO_FIJO', label: 'Plazo fijo' },
  ];

  onQuery(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }

  onType(event: Event): void {
    this.typeChange.emit((event.target as HTMLSelectElement).value as AccountTypeFilter);
  }
}
