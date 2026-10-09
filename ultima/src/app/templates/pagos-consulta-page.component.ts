import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FiltroEstado, Pago } from '../domain/pago.model';
import { filtrarPagos } from '../domain/filtrar-pagos';
import { PagosRepository } from '../domain/pagos.repository';
import { FilterBarComponent } from '../molecules/filter-bar.component';
import { PagosTableComponent } from '../organisms/pagos-table.component';

type Carga = 'loading' | 'success' | 'error';

/** Plantilla/página: orquesta carga, filtros y presentación de la consulta de pagos. */
@Component({
  selector: 'app-pagos-consulta-page',
  standalone: true,
  imports: [FilterBarComponent, PagosTableComponent],
  template: `
    <main class="container">
      <header>
        <h1>Consulta de pagos</h1>
        <p class="muted">Banca por Internet · Datos ficticios de ejemplo</p>
      </header>

      <app-filter-bar
        [texto]="texto()"
        [estado]="estado()"
        (textoChange)="texto.set($event)"
        (estadoChange)="estado.set($event)"
        (limpiar)="limpiar()"
      />

      @switch (carga()) {
        @case ('loading') {
          <p class="empty" role="status">Cargando pagos…</p>
        }
        @case ('error') {
          <p class="error" role="alert">No se pudo consultar los pagos. Intente nuevamente.</p>
          <button type="button" class="btn" (click)="cargar()">Reintentar</button>
        }
        @default {
          <p class="muted" role="status">{{ resumen() }}</p>
          <app-pagos-table [pagos]="visibles()" />
        }
      }
    </main>
  `,
})
export class PagosConsultaPageComponent implements OnInit {
  private readonly repositorio = inject(PagosRepository);

  protected readonly texto = signal('');
  protected readonly estado = signal<FiltroEstado>('TODOS');
  protected readonly carga = signal<Carga>('loading');
  private readonly pagos = signal<readonly Pago[]>([]);

  protected readonly visibles = computed(() =>
    filtrarPagos(this.pagos(), { texto: this.texto(), estado: this.estado() }),
  );
  protected readonly resumen = computed(() => {
    const n = this.visibles().length;
    return n === 1 ? '1 pago encontrado' : `${n} pagos encontrados`;
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.carga.set('loading');
    this.repositorio.consultar().subscribe({
      next: (lista) => {
        this.pagos.set(lista);
        this.carga.set('success');
      },
      error: () => this.carga.set('error'),
    });
  }

  protected limpiar(): void {
    this.texto.set('');
    this.estado.set('TODOS');
  }
}
