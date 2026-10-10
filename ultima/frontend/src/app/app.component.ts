import { Component } from '@angular/core';
import { NotificacionesPageComponent } from './notificaciones/pages/notificaciones.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificacionesPageComponent],
  template: `<app-notificaciones-page />`
})
export class AppComponent {}
