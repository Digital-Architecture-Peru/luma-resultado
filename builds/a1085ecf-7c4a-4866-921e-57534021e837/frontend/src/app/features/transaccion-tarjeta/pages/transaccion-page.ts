import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { EnvioTransaccion, FormularioTransaccion } from '../../../shared/ui/organisms/formulario-transaccion';
import { ResumenTransaccion } from '../../../shared/ui/organisms/resumen-transaccion';
import { LayoutTransaccion } from '../../../shared/ui/templates/layout-transaccion';
import { ResultadoTransaccion, Tarjeta } from '../models/transaccion.model';
import { TransaccionApiService } from '../services/transaccion-api.service';

/** Page: orquesta servicio y organismos. Una Idempotency-Key por intento lógico. */
@Component({
  selector: 'app-transaccion-page',
  imports: [LayoutTransaccion, FormularioTransaccion, ResumenTransaccion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-layout-transaccion>
      <div formulario>
        <app-formulario-transaccion [tarjetas]="tarjetas()" [ocupado]="ocupado()" (confirmar)="confirmar($event)" />
        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }
      </div>
      <div resultado>
        <app-resumen-transaccion [resultado]="resultado()" />
      </div>
    </app-layout-transaccion>
  `,
  styles: `.error { color: var(--danger); }`,
})
export class TransaccionPage implements OnInit {
  private readonly api = inject(TransaccionApiService);

  protected readonly tarjetas = signal<Tarjeta[]>([]);
  protected readonly ocupado = signal(false);
  protected readonly resultado = signal<ResultadoTransaccion | null>(null);
  protected readonly error = signal<string | null>(null);

  private claveActual = crypto.randomUUID();

  ngOnInit(): void {
    this.api.listarTarjetas().subscribe({
      next: (t) => this.tarjetas.set(t),
      error: () => this.error.set('No se pudieron cargar las tarjetas'),
    });
  }

  protected confirmar(envio: EnvioTransaccion): void {
    this.ocupado.set(true);
    this.error.set(null);
    this.api.registrar(envio.tarjetaId, envio.solicitud, this.claveActual).subscribe({
      next: (r) => {
        this.resultado.set(r);
        this.ocupado.set(false);
        this.claveActual = crypto.randomUUID();
      },
      error: (e: unknown) => {
        this.error.set(mensajeDeError(e));
        this.ocupado.set(false);
      },
    });
  }
}

function mensajeDeError(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    const detalle = (e.error as { detail?: string } | null)?.detail;
    return detalle ?? 'No se pudo procesar la transacción';
  }
  return 'Error inesperado';
}
