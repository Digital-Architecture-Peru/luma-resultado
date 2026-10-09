import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { validarMonto } from '../../../features/transaccion-tarjeta/models/validacion-monto';
import {
  SolicitudTransaccion,
  Tarjeta,
} from '../../../features/transaccion-tarjeta/models/transaccion.model';
import { Boton } from '../atoms/boton';
import { CampoConError } from '../molecules/campo-con-error';
import { SelectorTarjeta } from '../molecules/selector-tarjeta';

export interface EnvioTransaccion {
  tarjetaId: number;
  solicitud: SolicitudTransaccion;
}

/** Organism: formulario de cargo/pago; valida en cliente y emite el envío. */
@Component({
  selector: 'app-formulario-transaccion',
  imports: [Boton, CampoConError, SelectorTarjeta],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="$event.preventDefault()">
      <app-selector-tarjeta
        [tarjetas]="tarjetas()"
        [seleccionada]="tarjetaId()"
        (seleccionar)="seleccionarTarjeta($event)"
      />
      @if (errorTarjeta()) {
        <p class="error" role="alert">{{ errorTarjeta() }}</p>
      }
      <app-campo-con-error
        idCampo="monto"
        etiqueta="Monto (USD)"
        [valor]="montoTexto()"
        [error]="errorMonto()"
        (valorCambio)="cambiarMonto($event)"
      />
      <app-boton [deshabilitado]="ocupado()" (pulsado)="enviar()">
        {{ ocupado() ? 'Procesando…' : 'Confirmar transacción' }}
      </app-boton>
    </form>
  `,
  styles: `
    form { display: grid; gap: var(--space-4); }
    .error { margin: 0; color: var(--danger); }
  `,
})
export class FormularioTransaccion {
  readonly tarjetas = input.required<Tarjeta[]>();
  readonly ocupado = input(false);
  readonly confirmar = output<EnvioTransaccion>();

  protected readonly tarjetaId = signal<number | null>(null);
  protected readonly montoTexto = signal('');
  protected readonly errorMonto = signal<string | null>(null);
  protected readonly errorTarjeta = signal<string | null>(null);

  seleccionarTarjeta(id: number): void {
    this.tarjetaId.set(id);
    this.errorTarjeta.set(null);
  }

  cambiarMonto(texto: string): void {
    this.montoTexto.set(texto);
    this.errorMonto.set(null);
  }

  enviar(): void {
    const tarjetaId = this.tarjetaId();
    const { valor, error } = validarMonto(this.montoTexto());
    this.errorTarjeta.set(tarjetaId === null ? 'Seleccione una tarjeta' : null);
    this.errorMonto.set(error);
    if (tarjetaId === null || valor === null) {
      return;
    }
    this.confirmar.emit({ tarjetaId, solicitud: { monto: valor, moneda: 'USD' } });
  }
}
