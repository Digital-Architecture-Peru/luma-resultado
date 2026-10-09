import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PaymentsFacade } from './core/payments.facade';
import { PaymentDraft } from './core/payment.model';
import { PaymentFormComponent } from './organisms/payment-form.component';
import { PaymentHistoryComponent } from './organisms/payment-history.component';

/** Página: compone los organismos y muestra el resultado en role=status / alert. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaymentFormComponent, PaymentHistoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="container">
      <h1>Pagos - Banca por Internet</h1>
      <div role="status" aria-live="polite" class="feedback-region">
        @if (facade.feedback(); as fb) {
          @if (fb.kind === 'success') {
            <p class="feedback feedback-ok">{{ fb.message }}</p>
          }
        }
      </div>
      <div role="alert">
        @if (facade.feedback(); as fb) {
          @if (fb.kind === 'error') {
            <p class="feedback feedback-error">{{ fb.message }}</p>
          }
        }
      </div>
      <div class="grid">
        <app-payment-form [accounts]="facade.accounts()" [busy]="facade.busy()" (submitted)="pay($event)" />
        <app-payment-history [payments]="facade.history()" />
      </div>
    </main>
  `,
})
export class AppComponent implements OnInit {
  protected readonly facade = inject(PaymentsFacade);

  ngOnInit(): void {
    void this.facade.load();
  }

  protected pay(draft: PaymentDraft): void {
    void this.facade.pay(draft);
  }
}
