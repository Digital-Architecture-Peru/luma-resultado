import { Component } from '@angular/core';
import { NewPaymentPageComponent } from './payments/pages/new-payment-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NewPaymentPageComponent],
  template: `<app-new-payment-page />`,
})
export class AppComponent {}
