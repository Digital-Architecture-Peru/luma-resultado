import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-layout',
  standalone: true,
  template: `
    <header>
      <h1>{{ title }}</h1>
      <p>Banca por Internet · Pagos</p>
    </header>
    <main>
      <ng-content />
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        max-inline-size: 36rem;
        margin-inline: auto;
        padding: var(--space-6) clamp(1rem, 4vw, 2rem);
      }
      header p {
        margin: 0;
        color: var(--muted);
      }
      h1 {
        margin-block: 0 var(--space-1);
        font-size: clamp(1.5rem, 4vw, 2rem);
      }
      main {
        margin-block-start: var(--space-6);
        padding: var(--space-6);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
      }
    `,
  ],
})
export class PaymentLayoutComponent {
  @Input() title = '';
}
