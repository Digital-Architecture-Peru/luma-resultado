import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { maskCardNumber } from '../domain/card-query';
import { Card } from '../domain/card.model';

/** Molécula: resumen de una tarjeta con número enmascarado. */
@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CurrencyPipe, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <header>
        <h3>{{ card().holder }}</h3>
        <app-status-badge [status]="card().status" />
      </header>
      <p class="number">{{ masked() }}</p>
      <dl>
        <div><dt>Marca</dt><dd>{{ card().brand }}</dd></div>
        <div><dt>Vence</dt><dd>{{ card().expiry }}</dd></div>
        <div><dt>Saldo</dt><dd>{{ card().balance | currency: card().currency }}</dd></div>
        <div><dt>Cupo</dt><dd>{{ card().creditLimit | currency: card().currency }}</dd></div>
      </dl>
    </article>
  `,
  styles: [
    `
      .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); padding: var(--space-4); }
      header { display: flex; justify-content: space-between; gap: var(--space-2); align-items: flex-start; }
      h3 { margin: 0; font-size: 1.0625rem; }
      .number { font-variant-numeric: tabular-nums; letter-spacing: 0.05em; margin: var(--space-3) 0; }
      dl { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2); margin: 0; }
      dt { font-size: 0.75rem; color: var(--muted); }
      dd { margin: 0; font-variant-numeric: tabular-nums; }
    `,
  ],
})
export class CardItemComponent {
  readonly card = input.required<Card>();
  protected readonly masked = computed(() => maskCardNumber(this.card().last4));
}
