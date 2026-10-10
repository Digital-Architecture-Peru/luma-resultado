import { Component, OnInit, inject, signal } from '@angular/core';
import { EstadoCarga, Notificacion, Preferencia } from '../data/models';
import { NotificacionesService } from '../data/notificaciones.service';
import { ListaNotificacionesComponent } from '../organisms/lista-notificaciones.component';
import { PanelPreferenciasComponent } from '../organisms/panel-preferencias.component';
import { LayoutNotificacionesComponent } from '../templates/layout-notificaciones.component';

/** Token ficticio de tarjeta; en producción lo entrega la sesión de Banca por Internet. */
export const TARJETA_DEMO = 'tok_demo_001';

@Component({
  selector: 'app-notificaciones-page',
  standalone: true,
  imports: [LayoutNotificacionesComponent, ListaNotificacionesComponent, PanelPreferenciasComponent],
  template: `
    <app-layout-notificaciones>
      <h1 cabecera>Notificaciones de tu tarjeta</h1>
      <app-lista-notificaciones [items]="items()" [estado]="estado()" (marcar)="marcarLeida($event)" />
      <app-panel-preferencias lateral
        [preferencias]="preferencias()" [guardando]="guardando()" (guardar)="guardarPreferencias($event)" />
      <p role="status" lateral>{{ mensaje() }}</p>
    </app-layout-notificaciones>
  `
})
export class NotificacionesPageComponent implements OnInit {
  private readonly servicio = inject(NotificacionesService);

  readonly items = signal<Notificacion[]>([]);
  readonly preferencias = signal<Preferencia[]>([]);
  readonly estado = signal<EstadoCarga>('idle');
  readonly guardando = signal(false);
  readonly mensaje = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  marcarLeida(id: string): void {
    this.servicio.marcarLeida(id).subscribe({
      next: () => this.items.update(lista => lista.map(n => (n.id === id ? { ...n, leida: true } : n))),
      error: () => this.mensaje.set('No se pudo marcar la notificación como leída.')
    });
  }

  guardarPreferencias(prefs: Preferencia[]): void {
    this.guardando.set(true);
    this.servicio.guardarPreferencias(TARJETA_DEMO, prefs).subscribe({
      next: guardadas => {
        this.preferencias.set(guardadas);
        this.mensaje.set('Preferencias guardadas.');
        this.guardando.set(false);
      },
      error: () => {
        this.mensaje.set('No se pudieron guardar las preferencias.');
        this.guardando.set(false);
      }
    });
  }

  private cargar(): void {
    this.estado.set('loading');
    this.servicio.listar(TARJETA_DEMO).subscribe({
      next: pagina => {
        this.items.set(pagina.items);
        this.estado.set('success');
      },
      error: () => this.estado.set('error')
    });
    this.servicio.obtenerPreferencias(TARJETA_DEMO).subscribe({
      next: prefs => this.preferencias.set(prefs),
      error: () => this.mensaje.set('No se pudieron cargar las preferencias.')
    });
  }
}
