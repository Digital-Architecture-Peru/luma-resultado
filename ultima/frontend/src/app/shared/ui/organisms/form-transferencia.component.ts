import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Cuenta, TransferenciaSolicitud } from '../../../features/transferencias/data-access/models';
import { BotonComponent } from '../atoms/boton.component';
import { InputMontoComponent } from '../atoms/input-monto.component';
import { SelectorCuentaComponent } from '../molecules/selector-cuenta.component';

const FORMATO_MONTO = /^\d+(\.\d{1,2})?$/;
const MAX_CONCEPTO = 140;

/** Organismo: formulario de transferencia entre cuentas propias. */
@Component({
  selector: 'app-form-transferencia',
  imports: [BotonComponent, InputMontoComponent, SelectorCuentaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="card" novalidate aria-label="Transferencia entre cuentas propias" (submit)="onSubmit($event)">
      <app-selector-cuenta
        campoId="origen" etiqueta="Cuenta de origen" [cuentas]="cuentas()"
        [valor]="origenId()" [error]="errorOrigen()" (seleccionada)="origenId.set($event)" />
      <app-selector-cuenta
        campoId="destino" etiqueta="Cuenta de destino" [cuentas]="cuentas()"
        [valor]="destinoId()" [error]="errorDestino()" (seleccionada)="destinoId.set($event)" />
      <app-input-monto
        campoId="monto" etiqueta="Monto" [valor]="monto()" [error]="errorMonto()"
        (valorChange)="monto.set($event)" />
      <div class="campo">
        <label class="campo__etiqueta" for="concepto">Concepto (opcional)</label>
        <input class="campo__control" id="concepto" type="text" [maxLength]="maxConcepto"
          [value]="concepto()" (input)="concepto.set($any($event.target).value)" />
      </div>
      @if (errorServidor()) {
        <p class="campo__error" role="alert">{{ errorServidor() }}</p>
      }
      <app-boton tipo="submit" [deshabilitado]="enviando()">
        {{ enviando() ? 'Enviando…' : 'Transferir' }}
      </app-boton>
    </form>
  `,
})
export class FormTransferenciaComponent {
  readonly cuentas = input<Cuenta[]>([]);
  readonly enviando = input(false);
  readonly errorServidor = input<string | null>(null);
  readonly enviar = output<TransferenciaSolicitud>();

  protected readonly maxConcepto = MAX_CONCEPTO;
  readonly origenId = signal('');
  readonly destinoId = signal('');
  readonly monto = signal('');
  readonly concepto = signal('');
  private readonly intentado = signal(false);

  private readonly origen = computed(() => this.cuentas().find((c) => c.id === this.origenId()));
  private readonly destino = computed(() => this.cuentas().find((c) => c.id === this.destinoId()));
  private readonly montoValido = computed(() => {
    const texto = this.monto().trim();
    return FORMATO_MONTO.test(texto) && Number(texto) > 0;
  });

  protected readonly errorOrigen = computed(() =>
    this.intentado() && !this.origenId() ? 'Seleccione la cuenta de origen.' : null);

  protected readonly errorDestino = computed(() => {
    if (!this.intentado()) return null;
    if (!this.destinoId()) return 'Seleccione la cuenta de destino.';
    if (this.destinoId() === this.origenId()) return 'El destino debe ser distinto del origen.';
    const origen = this.origen();
    const destino = this.destino();
    if (origen && destino && destino.moneda !== origen.moneda) {
      return 'Las cuentas deben tener la misma moneda.';
    }
    return null;
  });

  protected readonly errorMonto = computed(() => {
    if (!this.intentado()) return null;
    if (!this.montoValido()) return 'Ingrese un monto mayor que cero con máximo 2 decimales.';
    const origen = this.origen();
    if (origen && Number(this.monto()) > origen.saldo) return 'El monto supera el saldo disponible.';
    return null;
  });

  readonly valido = computed(() => {
    const origen = this.origen();
    const destino = this.destino();
    return (
      !!origen && !!destino && origen.id !== destino.id && origen.moneda === destino.moneda &&
      this.montoValido() && Number(this.monto()) <= origen.saldo
    );
  });

  protected onSubmit(evento: Event): void {
    evento.preventDefault();
    this.intentado.set(true);
    const origen = this.origen();
    if (!this.valido() || !origen) return;
    this.enviar.emit({
      origenId: origen.id,
      destinoId: this.destinoId(),
      monto: Number(this.monto().trim()),
      moneda: origen.moneda,
      concepto: this.concepto().trim(),
    });
  }
}
