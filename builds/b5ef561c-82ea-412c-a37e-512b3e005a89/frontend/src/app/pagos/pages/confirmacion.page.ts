import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetallePagoComponent } from '../organisms/detalle-pago.component';
import { Pago } from '../pago.model';
import { PagosApiService } from '../services/pagos-api.service';
import { LayoutTransaccionComponent } from '../templates/layout-transaccion.component';
import { mensajeDeError } from './nuevo-pago.page';

@Component({
  selector: 'app-confirmacion-page',
  imports: [LayoutTransaccionComponent, DetallePagoComponent, RouterLink],
  template: `
    <app-layout-transaccion titulo="Resultado del pago">
      @if (pago(); as p) {
        <app-detalle-pago [pago]="p" />
      } @else if (error(); as mensaje) {
        <p class="error" role="alert">{{ mensaje }}</p>
      } @else {
        <p role="status">Cargando…</p>
      }
      <p><a routerLink="/pagos/nuevo">Realizar otro pago</a></p>
    </app-layout-transaccion>
  `,
})
export class ConfirmacionPage implements OnInit {
  private readonly api = inject(PagosApiService);
  private readonly route = inject(ActivatedRoute);

  readonly pago = signal<Pago | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Identificador de pago ausente.');
      return;
    }
    this.api.obtener(id).subscribe({
      next: (p) => this.pago.set(p),
      error: (e: unknown) => this.error.set(mensajeDeError(e)),
    });
  }
}
