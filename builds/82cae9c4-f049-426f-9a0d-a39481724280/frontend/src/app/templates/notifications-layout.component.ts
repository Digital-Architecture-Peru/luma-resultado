import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications-layout',
  standalone: true,
  template: `
    <header class="layout__header">
      <h1>Notificaciones de pagos</h1>
      <ng-content select="[slot=bell]" />
    </header>
    <main class="layout__main">
      <ng-content />
    </main>
  `,
})
export class NotificationsLayoutComponent {}
