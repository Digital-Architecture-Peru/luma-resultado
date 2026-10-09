import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Account, Payment, PaymentSubmission } from '../models/payment.models';
import { PaymentFormComponent } from '../organisms/payment-form.component';
import { PaymentReceiptComponent } from '../organisms/payment-receipt.component';
import { PaymentApiService } from '../services/payment-api.service';
import { PaymentLayoutComponent } from '../templates/payment-layout.component';

const GENERIC_ERROR = 'No fue posible procesar el pago. Intente nuevamente.';

@Component({
  selector: 'app-new-payment-page',
  standalone: true,
  imports: [PaymentLayoutComponent, PaymentFormComponent, PaymentReceiptComponent],
  template: `
    <app-payment-layout title="Nuevo pago">
      @if (error()) {
        <p class="alert-error" role="alert">{{ error() }}</p>
      }
      @if (receipt(); as r) {
        <app-payment-receipt [payment]="r" (newPayment)="startOver()" />
      } @else {
        <app-payment-form [accounts]="accounts()" [busy]="busy()" (submitPayment)="pay($event)" />
      }
    </app-payment-layout>
  `,
})
export class NewPaymentPageComponent implements OnInit {
  private readonly api = inject(PaymentApiService);

  readonly accounts = signal<Account[]>([]);
  readonly receipt = signal<Payment | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAccounts();
  }

  pay(submission: PaymentSubmission): void {
    this.busy.set(true);
    this.error.set(null);
    this.api.create(submission.request, submission.idempotencyKey).subscribe({
      next: (payment) => {
        this.receipt.set(payment);
        this.busy.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.detail ?? GENERIC_ERROR);
        this.busy.set(false);
      },
    });
  }

  startOver(): void {
    this.receipt.set(null);
    this.error.set(null);
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.api.accounts().subscribe({
      next: (list) => this.accounts.set(list),
      error: () => this.error.set('No fue posible cargar sus cuentas.'),
    });
  }
}
