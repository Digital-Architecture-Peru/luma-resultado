import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-layout',
  standalone: true,
  template: `
    <header class="top"><h1>{{ title }}</h1></header>
    <main class="layout">
      <section aria-label="Formulario de transferencia"><ng-content /></section>
      <aside aria-label="Movimientos"><ng-content select="[aside]" /></aside>
    </main>
  `,
})
export class TransactionLayoutComponent {
  @Input() title = '';
}
