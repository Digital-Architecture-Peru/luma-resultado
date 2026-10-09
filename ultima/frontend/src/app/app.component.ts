import { Component } from '@angular/core';
import { CardTransactionPageComponent } from './features/card-transaction/pages/card-transaction-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardTransactionPageComponent],
  template: '<app-card-transaction-page />',
})
export class AppComponent {}
