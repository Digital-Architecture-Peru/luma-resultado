import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications-layout',
  standalone: true,
  template: `
    <div class="layout">
      <header class="layout__header">
        <h1>Notificaciones de tarjetas</h1>
        <ng-content select="[toolbar]" />
      </header>
      <main class="layout__main">
        <section aria-labelledby="inbox-title">
          <h2 id="inbox-title">Bandeja</h2>
          <ng-content select="[inbox]" />
        </section>
        <aside aria-labelledby="prefs-title">
          <h2 id="prefs-title">Preferencias</h2>
          <ng-content select="[prefs]" />
        </aside>
      </main>
    </div>
  `,
})
export class NotificationsLayoutComponent {}
