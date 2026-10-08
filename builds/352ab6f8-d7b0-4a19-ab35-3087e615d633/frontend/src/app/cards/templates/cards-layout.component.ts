import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-layout',
  standalone: true,
  template: `
    <main class="layout">
      <h1>{{ title }}</h1>
      <ng-content />
    </main>
  `,
  styles: [
    `
      .layout {
        max-width: 48rem;
        margin: 0 auto;
        padding: var(--space-6) var(--space-4);
      }
    `,
  ],
})
export class CardsLayoutComponent {
  @Input({ required: true }) title!: string;
}
