import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PaymentFlow } from './domain/payment-flow';
import { PaymentFormComponent } from './organisms/payment-form.component';
import { PaymentReceiptComponent } from './organisms/payment-receipt.component';
import { PaymentReviewComponent } from './organisms/payment-review.component';

/** Página: compone los organismos según el paso del flujo. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaymentFormComponent, PaymentReviewComponent, PaymentReceiptComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="page">
      <header>
        <h1>Pago de tarjetas</h1>
        <p class="muted">Banca por Internet · datos de ejemplo</p>
      </header>

      @if (flow.loading() && flow.cards().length === 0) {
        <p role="status">Cargando tus productos…</p>
      } @else if (flow.loadError() !== null) {
        <p class="errors" role="alert">{{ flow.loadError() }}</p>
        <button type="button" class="btn" (click)="retry()">Reintentar</button>
      } @else {
        @switch (flow.step()) {
          @case ('form') { <app-payment-form /> }
          @case ('review') { <app-payment-review /> }
          @case ('done') { <app-payment-receipt /> }
        }
      }
    </main>
  `,
})
export class AppComponent implements OnInit {
  protected readonly flow = inject(PaymentFlow);

  ngOnInit(): void {
    void this.flow.load();
  }

  protected retry(): void {
    void this.flow.load();
  }
}
