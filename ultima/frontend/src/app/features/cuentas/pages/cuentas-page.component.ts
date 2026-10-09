import { Component, OnInit, inject, signal } from '@angular/core';
import { CuentasListaComponent } from '../../../ui/organisms/cuentas-lista/cuentas-lista.component';
import { PaginaTemplateComponent } from '../../../ui/templates/pagina-template/pagina-template.component';
import { Cuenta } from '../models/cuenta.model';
import { CuentasService } from '../services/cuentas.service';

type EstadoPagina = 'cargando' | 'listo' | 'error';

/** Página: orquesta datos (servicio) y composición de UI (template + organismo). */
@Component({
  selector: 'app-cuentas-page',
  standalone: true,
  imports: [PaginaTemplateComponent, CuentasListaComponent],
  template: `
    <app-pagina-template titulo="Consulta de cuentas">
      @switch (estado()) {
        @case ('cargando') {
          <p class="mensaje" role="status">Cargando cuentas…</p>
        }
        @case ('error') {
          <p class="mensaje mensaje--error" role="alert">No se pudieron cargar las cuentas. Intente nuevamente.</p>
        }
        @default {
          <app-cuentas-lista [cuentas]="cuentas()" />
        }
      }
    </app-pagina-template>
  `,
})
export class CuentasPageComponent implements OnInit {
  private readonly servicio = inject(CuentasService);

  readonly cuentas = signal<Cuenta[]>([]);
  readonly estado = signal<EstadoPagina>('cargando');

  ngOnInit(): void {
    this.servicio.listar().subscribe({
      next: (cuentas) => {
        this.cuentas.set(cuentas);
        this.estado.set('listo');
      },
      error: () => this.estado.set('error'),
    });
  }
}
