import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { STATUS_LABELS, StatusFilter } from '../domain/card.model';

/** Molécula: búsqueda de texto + selector de estado. Solo emite eventos. */
@Component({
  selector: 'app-card-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="filter" role="search" (submit)="$event.preventDefault()">
      <label>
        Buscar
        <input type="search" name="text" placeholder="Titular, marca o últimos 4 dígitos" (input)="onText($event)" />
      </label>
      <label>
        Estado
        <select name="status" (change)="onStatus($event)">
          <option value="ALL">Todos</option>
          @for (option of options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </label>
    </form>
  `,
  styles: [
    `
      .filter { display: flex; flex-wrap: wrap; gap: var(--space-4); }
      label { display: flex; flex-direction: column; gap: var(--space-1); font-size: 0.875rem; color: var(--muted); flex: 1 1 14rem; }
      input, select { min-height: 2.5rem; padding: 0 var(--space-3); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); font: inherit; }
    `,
  ],
})
export class CardFilterComponent {
  readonly textChange = output<string>();
  readonly statusChange = output<StatusFilter>();

  protected readonly options = (Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[]).map(
    (value) => ({ value, label: STATUS_LABELS[value] }),
  );

  protected onText(event: Event): void {
    this.textChange.emit((event.target as HTMLInputElement).value);
  }

  protected onStatus(event: Event): void {
    this.statusChange.emit((event.target as HTMLSelectElement).value as StatusFilter);
  }
}
