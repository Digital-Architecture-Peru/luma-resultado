import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CardQuery, StatusFilter } from '../domain/card.model';

@Component({
  selector: 'app-card-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="filter" (submit)="$event.preventDefault()" role="search">
      <div class="field">
        <label for="filter-text">Buscar tarjeta</label>
        <input
          id="filter-text"
          type="search"
          placeholder="Titular, marca o últimos 4 dígitos"
          [value]="query.text"
          (input)="onText($event)"
        />
      </div>
      <div class="field">
        <label for="filter-status">Estado</label>
        <select id="filter-status" [value]="query.status" (change)="onStatus($event)">
          <option value="all">Todas</option>
          <option value="active">Activas</option>
          <option value="blocked">Bloqueadas</option>
          <option value="expired">Vencidas</option>
        </select>
      </div>
    </form>
  `,
})
export class CardFilterComponent {
  @Input({ required: true }) query!: CardQuery;
  @Output() queryChange = new EventEmitter<CardQuery>();

  onText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.queryChange.emit({ ...this.query, text });
  }

  onStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value as StatusFilter;
    this.queryChange.emit({ ...this.query, status });
  }
}
