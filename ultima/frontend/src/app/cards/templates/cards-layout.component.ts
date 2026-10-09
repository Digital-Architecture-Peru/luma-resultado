import { Component, Input } from '@angular/core';

/** Plantilla: estructura común de las páginas de tarjetas. */
@Component({
  selector: 'app-cards-layout',
  standalone: true,
  template: `
    <main class="layout">
      <h1>{{ title }}</h1>
      <ng-content />
    </main>
  `,
  styles: [`
    .layout { max-width: 72rem; margin: 0 auto; padding: var(--space-6) clamp(1rem, 4vw, 2rem); }
    h1 { margin-top: 0; }
  `],
})
export class CardsLayoutComponent {
  @Input() title = 'Mis tarjetas';
}
