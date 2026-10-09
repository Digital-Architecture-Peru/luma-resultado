import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-layout',
  standalone: true,
  template: `<div class="shell">
    <header>
      <h1>{{ title }}</h1>
      <p class="muted">{{ subtitle }}</p>
    </header>
    <main class="layout">
      <section aria-label="Formulario"><ng-content select="[main]" /></section>
      <aside aria-label="Cuentas y movimientos"><ng-content select="[aside]" /></aside>
    </main>
  </div>`,
})
export class TransactionLayoutComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
