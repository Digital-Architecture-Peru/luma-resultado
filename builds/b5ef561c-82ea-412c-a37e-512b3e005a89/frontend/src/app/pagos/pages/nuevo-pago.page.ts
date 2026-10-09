import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PagoRequest } from '../pago.model';
import { FormularioPagoComponent } from '../organisms/formulario-pago.component';
import { PagosApiService } from '../services/pagos-api.service';
import { LayoutTransaccionComponent } from '../templates/layout-transaccion.component';

export function mensajeDeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const detalle = (error.error as { detail?: string } | null)?.detail;
    if (detalle) {
      return detalle;
    }
  }
  return 'No se pudo registrar el pago. Intente nuevamente.';
}

@Component({
  selector: 'app-nuevo-pago-page',
  imports: [LayoutTransaccionComponent, FormularioPagoComponent],
  template: `
    <app-layout-transaccion titulo="Nuevo pago">
      <app-formulario-pago [enviando]="enviando()" (pagoEnviado)="registrar($event)" />
      <div role="status" aria-live="polite">
        @if (error(); as mensaje) {
          <p class="error">{{ mensaje }}</p>
        }
      </div>
    </app-layout-transaccion>
  `,
})
export class NuevoPagoPage {
  private readonly api = inject(PagosApiService);
  private readonly router = inject(Router);

  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  // Misma clave en reintentos del mismo intento de pago: evita duplicados.
  private readonly idempotencyKey = crypto.randomUUID();

  registrar(solicitud: PagoRequest): void {
    this.enviando.set(true);
    this.error.set(null);
    this.api.crear(solicitud, this.idempotencyKey).subscribe({
      next: (pago) => void this.router.navigate(['/pagos', pago.id]),
      error: (e: unknown) => {
        this.error.set(mensajeDeError(e));
        this.enviando.set(false);
      },
    });
  }
}
