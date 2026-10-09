import { Component } from '@angular/core';
import { TransactionsPageComponent } from './ui/pages/transactions-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TransactionsPageComponent],
  template: `<app-transactions-page />`,
})
export class AppComponent {}
