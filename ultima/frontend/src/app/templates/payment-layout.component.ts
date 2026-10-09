import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-layout',
  standalone: true,
  template: `
    <main class="layout">
      <h1>{{ title }}</h1>
      <section class="card"><ng-content></ng-content></section>
    </main>`,
  styles: [
    `.layout { max-width: 36rem; margin-inline: auto; padding: 24px 16px; }
     .card { background: var(--surface); border: 1px solid var(--border);
             border-radius: 8px; box-shadow: var(--shadow-sm); padding: 24px; }`
  ]
})
export class PaymentLayoutComponent {
  @Input() title = 'Pagos';
}
