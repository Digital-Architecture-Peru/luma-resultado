import { Component } from '@angular/core';

@Component({
  selector: 'app-cards-layout',
  standalone: true,
  template: `
    <main class="layout">
      <h1>Mis tarjetas</h1>
      <ng-content />
    </main>
  `,
  styles: [
    `
      .layout { max-inline-size: 72rem; margin-inline: auto; padding: var(--space-6) clamp(1rem, 4vw, 2rem); }
    `,
  ],
})
export class CardsLayoutComponent {}
