import { Component } from '@angular/core';
import { CardTransactionsPage } from './pages/card-transactions.page';

@Component({
  selector: 'app-root',
  imports: [CardTransactionsPage],
  template: '<app-card-transactions-page />',
})
export class App {}
