import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FiltroPagos, Pagina, Pago } from '../models/pago.model';
import { PagosApiService } from '../services/pagos-api.service';
import { FiltrosPagosComponent } from '../../../shared/ui/molecules/filtros-pagos.component';
import { TablaPagosComponent } from '../../../shared/ui/organisms/tabla-pagos.component';
import { TemplateConsultaComponent } from '../../../shared/ui/templates/template-consulta.component';

const TAMANO_PAGINA = 20;

/** Página: orquesta el servicio y compone el template con los organismos. */
@Component({
  selector: 'app-consulta-pagos-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TemplateConsultaComponent, FiltrosPagosComponent, TablaPagosComponent],
  template: `
    <app-template-consulta>
      <app-filtros-pagos filtros (filtrar)="aplicarFiltro($event)" />
      <div resultados>
        @if (cargando()) {
          <p role="status">Cargando pagos…</p>
        } @else if (error()) {
          <p role="alert">{{ error() }}</p>
        } @else {
          <app-tabla-pagos [pagos]="pagos()" />
        }
      </div>
      <div paginacion>
        <button type="button" (click)="irA(pagina().page - 1)" [disabled]="pagina().page <= 0 || cargando()">
          Anterior
        </button>
        <span class="info">Página {{ pagina().page + 1 }} de {{ pagina().totalPaginas || 1 }}</span>
        <button type="button" (click)="irA(pagina().page + 1)"
          [disabled]="pagina().page + 1 >= pagina().totalPaginas || cargando()">
          Siguiente
        </button>
      </div>
    </app-template-consulta>
  `,
  styles: [`.info { padding-inline: 1rem; align-self: center; }`],
})
export class ConsultaPagosPageComponent implements OnInit {
  private readonly api = inject(PagosApiService);

  readonly pagina = signal<Pagina<Pago>>({ contenido: [], page: 0, size: TAMANO_PAGINA, totalElementos: 0, totalPaginas: 0 });
  readonly pagos = signal<Pago[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  private filtro: FiltroPagos = { estado: '', desde: '', hasta: '' };

  ngOnInit(): void {
    this.cargar(0);
  }

  aplicarFiltro(filtro: FiltroPagos): void {
    this.filtro = filtro;
    this.cargar(0);
  }

  irA(page: number): void {
    this.cargar(page);
  }

  private cargar(page: number): void {
    this.cargando.set(true);
    this.error.set(null);
    this.api.listar(this.filtro, page, TAMANO_PAGINA).subscribe({
      next: (resultado) => {
        this.pagina.set(resultado);
        this.pagos.set(resultado.contenido);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible consultar los pagos. Intente nuevamente.');
        this.cargando.set(false);
      },
    });
  }
}
