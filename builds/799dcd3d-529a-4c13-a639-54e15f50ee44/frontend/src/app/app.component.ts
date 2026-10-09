import { Component } from '@angular/core';
import { NotificacionesTarjetaPage } from './pages/notificaciones-tarjeta.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificacionesTarjetaPage],
  template: '<app-notificaciones-tarjeta-page />',
})
export class AppComponent {}
