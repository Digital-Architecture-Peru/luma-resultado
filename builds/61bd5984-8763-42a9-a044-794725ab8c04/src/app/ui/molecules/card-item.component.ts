import { Component, input, output } from '@angular/core';
import { Card, maskedNumber } from '../../domain/card';
import { formatCents } from '../../domain/money';
import { StatusBadgeComponent } from '../atoms/status-badge.component';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <button
      type="button"
      class="card-item"
      [class.selected]="selected()"
      [attr.aria-pressed]="selected()"
      (click)="choose.emit(card().id)"
    >
      <span class="card-alias">{{ card().alias }}</span>
      <span class="card-number">{{ number() }}</span>
      <span class="card-available">Disponible: {{ money(card().availableCents) }}</span>
      <app-status-badge [status]="card().status" />
    </button>
  `,
})
export class CardItemComponent {
  readonly card = input.required<Card>();
  readonly selected = input(false);
  readonly choose = output<string>();

  number(): string {
    return maskedNumber(this.card());
  }

  money(cents: number): string {
    return formatCents(cents);
  }
}
