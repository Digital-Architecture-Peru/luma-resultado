import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ComprobanteComponent } from '../../../shared/ui/organisms/comprobante.component';
import { FormTransferenciaComponent } from '../../../shared/ui/organisms/form-transferencia.component';
import { TransferenciaTemplateComponent } from '../../../shared/ui/templates/transferencia-template.component';
import { Comprobante, Cuenta, TransferenciaSolicitud } from '../data-access/models';
import { TransferenciasService } from '../data-access/transferencias.service';

const MENSAJE_GENERICO = 'No fue posible completar la operación. Intente nuevamente.';

@Component({
  selector: 'app-transferencia-page',
  imports: [TransferenciaTemplateComponent, FormTransferenciaComponent, ComprobanteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-transferencia-template>
      @if (cargando()) {
        <p slot="estado" role="status">Cargando cuentas…</p>
      }
      <app-form-transferencia
        slot="formulario"
        [cuentas]="cuentas()"
        [enviando]="enviando()"
        [errorServidor]="error()"
        (enviar)="transferir($event)" />
      @if (comprobante(); as c) {
        <app-comprobante slot="resultado" [comprobante]="c" />
      }
    </app-transferencia-template>
  `,
})
export class TransferenciaPageComponent implements OnInit {
  private readonly servicio = inject(TransferenciasService);

  readonly cuentas = signal<Cuenta[]>([]);
  readonly cargando = signal(true);
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  readonly comprobante = signal<Comprobante | null>(null);

  /** La clave se conserva entre reintentos de la misma operación para evitar duplicados. */
  private claveIdempotencia: string | null = null;

  ngOnInit(): void {
    this.cargarCuentas();
  }

  transferir(solicitud: TransferenciaSolicitud): void {
    this.claveIdempotencia ??= crypto.randomUUID();
    this.enviando.set(true);
    this.error.set(null);
    this.comprobante.set(null);
    this.servicio.transferir(solicitud, this.claveIdempotencia).subscribe({
      next: (c) => {
        this.comprobante.set(c);
        this.enviando.set(false);
        this.claveIdempotencia = null;
        this.cargarCuentas();
      },
      error: (e: unknown) => {
        this.error.set(this.mensajeDe(e));
        this.enviando.set(false);
      },
    });
  }

  private cargarCuentas(): void {
    this.servicio.listarCuentas().subscribe({
      next: (cuentas) => {
        this.cuentas.set(cuentas);
        this.cargando.set(false);
      },
      error: (e: unknown) => {
        this.error.set(this.mensajeDe(e));
        this.cargando.set(false);
      },
    });
  }

  private mensajeDe(e: unknown): string {
    if (e instanceof HttpErrorResponse && typeof e.error?.detail === 'string') {
      return e.error.detail;
    }
    return MENSAJE_GENERICO;
  }
}
