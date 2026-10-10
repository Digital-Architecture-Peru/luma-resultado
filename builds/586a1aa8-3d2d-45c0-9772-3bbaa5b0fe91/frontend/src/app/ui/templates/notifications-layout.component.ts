import { Component, Input } from '@angular/core';

/** Plantilla: estructura de la pantalla con dos zonas proyectadas. */
@Component({
  selector: 'app-notifications-layout',
  standalone: true,
  template: `
    <main class="layout">
      <h1>{{ title }}</h1>
      <section aria-label="Bandeja de notificaciones">
        <ng-content select="[slot=list]" />
      </section>
      <section aria-label="Preferencias de notificación">
        <h2>Preferencias</h2>
        <ng-content select="[slot=preferences]" />
      </section>
    </main>
  `,
  styles: [
    `
      .layout {
        display: grid;
        gap: var(--space-6);
        max-inline-size: 72rem;
        margin-inline: auto;
        padding: var(--space-6) clamp(1rem, 4vw, 2rem);
      }
    `,
  ],
})
export class NotificationsLayoutComponent {
  @Input() title = '';
}
