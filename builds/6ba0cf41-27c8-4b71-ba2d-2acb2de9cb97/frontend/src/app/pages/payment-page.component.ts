import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Payment, PaymentRequest } from '../core/models';
import { PaymentApiService, describeError } from '../core/payment-api.service';
import { PaymentConfirmComponent } from '../organisms/payment-confirm.component';
import { PaymentFormComponent } from '../organisms/payment-form.component';
import { PaymentReceiptComponent } from '../organisms/payment-receipt.component';
import { PaymentLayoutComponent } from '../templates/payment-layout.component';

type Step = 'form' | 'confirm' | 'receipt';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [PaymentLayoutComponent, PaymentFormComponent, PaymentConfirmComponent, PaymentReceiptComponent],
  template: `
    <app-payment-layout title="Pagos · Banca por Internet">
      @switch (step()) {
        @case ('form') {
          <app-payment-form [accounts]="accounts" (submitted)="onSubmitted($event)"></app-payment-form>
        }
        @case ('confirm') {
          <app-payment-confirm
            [request]="request()!" [busy]="busy()" [errorMessage]="error()"
            (confirmed)="onConfirmed()" (back)="step.set('form')"></app-payment-confirm>
        }
        @case ('receipt') {
          <app-payment-receipt [payment]="payment()!" (another)="reset()"></app-payment-receipt>
        }
      }
    </app-payment-layout>`
})
export class PaymentPageComponent {
  private readonly api = inject(PaymentApiService);

  // Cuentas ficticias de ejemplo.
  readonly accounts = ['00100000000001', '00100000000002'];

  readonly step = signal<Step>('form');
  readonly request = signal<PaymentRequest | null>(null);
  readonly payment = signal<Payment | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  private idempotencyKey = crypto.randomUUID();

  onSubmitted(request: PaymentRequest): void {
    this.idempotencyKey = crypto.randomUUID(); // nueva intención de pago
    this.request.set(request);
    this.error.set(null);
    this.step.set('confirm');
  }

  onConfirmed(): void {
    const request = this.request();
    if (!request || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.api.create(request, this.idempotencyKey).subscribe({
      next: (payment) => {
        this.payment.set(payment);
        this.busy.set(false);
        this.step.set('receipt');
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.error.set(describeError(err));
      }
    });
  }

  reset(): void {
    this.request.set(null);
    this.payment.set(null);
    this.error.set(null);
    this.step.set('form');
  }
}
