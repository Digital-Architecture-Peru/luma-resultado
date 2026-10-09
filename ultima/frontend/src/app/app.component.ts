import { Component } from '@angular/core';
import { CardPaymentPageComponent } from './pages/card-payment.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardPaymentPageComponent],
  template: `<app-card-payment-page />`,
})
export class AppComponent {}
