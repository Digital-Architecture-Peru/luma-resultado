import { Component } from '@angular/core';

/** Template: estructura de la pantalla (cabecera, contenido principal y lateral). */
@Component({
  selector: 'app-notifications-layout',
  standalone: true,
  template: `
    <header class="top"><h1>Notificaciones de mis cuentas</h1><ng-content select="[slot=header]" /></header>
    <main class="grid">
      <section aria-label="Notificaciones"><ng-content select="[slot=main]" /></section>
      <aside aria-label="Preferencias"><ng-content select="[slot=aside]" /></aside>
    </main>
  `,
  styles: [`
    :host { display: block; max-width: 72rem; margin-inline: auto; padding: var(--space-4); }
    .top { display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: center; justify-content: space-between; }
    h1 { font-size: clamp(1.25rem, 3vw, 1.75rem); margin: 0; }
    .grid { display: grid; gap: var(--space-6); margin-top: var(--space-4); grid-template-columns: 1fr; }
    @media (min-width: 768px) { .grid { grid-template-columns: 2fr 1fr; } }
  `],
})
export class NotificationsLayoutComponent {}
