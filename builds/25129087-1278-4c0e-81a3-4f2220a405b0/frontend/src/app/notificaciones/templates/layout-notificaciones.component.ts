import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-notificaciones',
  standalone: true,
  template: `
    <div class="layout">
      <header><ng-content select="[cabecera]" /></header>
      <main><ng-content /></main>
      <aside><ng-content select="[lateral]" /></aside>
    </div>
  `,
  styles: [`
    .layout { display: grid; gap: var(--space-6); max-inline-size: 72rem; margin-inline: auto;
              padding: var(--space-4); grid-template-columns: 1fr; }
    header { grid-column: 1 / -1; }
    @media (min-width: 768px) { .layout { grid-template-columns: 2fr 1fr; } }
  `]
})
export class LayoutNotificacionesComponent {}
