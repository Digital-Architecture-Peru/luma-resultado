import { Component, Input } from '@angular/core';
import { AmountComponent } from '../atoms/amount.component';
import { MaskedPanComponent } from '../atoms/masked-pan.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { CardDetail } from '../data/card.model';

@Component({
  selector: 'app-card-detail-panel',
  standalone: true,
  imports: [AmountComponent, MaskedPanComponent, StatusBadgeComponent],
  template: `
    @if (card) {
      <section class="panel" aria-label="Detalle de la tarjeta">
        <h2><app-masked-pan [pan]="card.maskedPan" /> <app-status-badge [status]="card.status" /></h2>
        <dl>
          <dt>Tipo</dt><dd>{{ card.type === 'CREDIT' ? 'Crédito' : 'Débito' }}</dd>
          <dt>Límite de crédito</dt><dd><app-amount [value]="card.creditLimit" [currency]="card.currency" /></dd>
          <dt>Saldo disponible</dt><dd><app-amount [value]="card.availableBalance" [currency]="card.currency" /></dd>
          <dt>Vencimiento</dt><dd>{{ card.expiryMonth }}/{{ card.expiryYear }}</dd>
        </dl>
      </section>
    } @else {
      <p class="hint">Selecciona una tarjeta para ver su detalle.</p>
    }
  `,
  styles: [`
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 16px 24px; box-shadow: var(--shadow-sm); }
    h2 { display: flex; gap: 12px; align-items: center; margin: 0 0 12px; font-size: 1.2rem; }
    dl { display: grid; grid-template-columns: max-content 1fr; gap: 8px 24px; margin: 0; }
    dt { color: var(--muted); }
    dd { margin: 0; }
    .hint { color: var(--muted); }
  `],
})
export class CardDetailPanelComponent {
  @Input() card: CardDetail | null = null;
}
