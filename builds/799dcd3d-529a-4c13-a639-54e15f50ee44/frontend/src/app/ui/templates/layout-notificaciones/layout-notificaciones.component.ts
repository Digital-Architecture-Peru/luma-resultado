import { Component } from '@angular/core';

/** Template: estructura de la pantalla con ranuras para controles y contenido. */
@Component({
  selector: 'app-layout-notificaciones',
  standalone: true,
  template: `
    <main class="layout">
      <header>
        <h1>Notificaciones de tarjetas</h1>
        <ng-content select="[controles]" />
      </header>
      <section aria-live="polite">
        <ng-content />
      </section>
    </main>
  `,
  styles: [
    `
      .layout { max-width: 48rem; margin: 0 auto; padding: 1rem; }
      header { display: grid; gap: 0.75rem; margin-bottom: 1rem; }
      h1 { font-size: 1.5rem; margin: 0; }
    `,
  ],
})
export class LayoutNotificacionesComponent {}
