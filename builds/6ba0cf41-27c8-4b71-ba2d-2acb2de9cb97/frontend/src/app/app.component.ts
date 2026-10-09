import { Component } from '@angular/core';
import { PaymentPageComponent } from './pages/payment-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaymentPageComponent],
  template: `<app-payment-page></app-payment-page>`
})
export class AppComponent {}
