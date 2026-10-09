import { Component, Input } from '@angular/core';
import { CardDetail } from '../data/card.model';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { BalanceSummaryComponent } from '../molecules/balance-summary.component';

/** Organismo: detalle de una tarjeta. */
@Component({
  selector: 'app-card-detail-panel',
  standalone: true,
  imports: [MaskedPanComponent, StatusBadgeComponent, BalanceSummaryComponent],
  template: `
    <section class="panel" [attr.aria-label]="'Detalle de ' + card.alias">
      <h2>{{ card.alias }}</h2>
      <app-masked-pan [value]="card.maskedPan" />
      <app-status-badge [status]="card.status" />
      <app-balance-summary [limit]="card.creditLimit" [available]="card.availableBalance" [currency]="card.currency" />
      <p class="meta">Vence: {{ card.expiry }} · Día de corte: {{ card.cutoffDay }} · {{ card.brand }}</p>
    </section>
  `,
  styles: [`
    .panel { display: grid; gap: var(--space-2); padding: var(--space-6); background: var(--surface);
             border: 1px solid var(--border); border-radius: var(--radius); }
    h2 { margin: 0; }
    .meta { color: var(--muted); margin: 0; }
  `],
})
export class CardDetailPanelComponent {
  @Input({ required: true }) card!: CardDetail;
}
