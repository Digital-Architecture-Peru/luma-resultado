import { Component, input } from '@angular/core';

/** Template: estructura de página (cabecera + contenido proyectado). */
@Component({
  selector: 'app-account-layout',
  template: `
    <header class="layout-header">
      <h1>{{ title() }}</h1>
      <p class="muted">{{ subtitle() }}</p>
    </header>
    <main class="layout-main">
      <ng-content />
    </main>
  `,
})
export class AccountLayoutComponent {
  readonly title = input.required<string>();
  readonly subtitle = input('');
}
