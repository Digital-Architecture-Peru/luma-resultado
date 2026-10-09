import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsApi } from '../data/accounts.api';
import { Cuenta } from '../data/account.model';
import { LayoutConsultaComponent } from '../templates/layout-consulta.template';
import { ListaCuentasComponent } from '../organisms/lista-cuentas.organism';

type Estado = { tipo: 'cargando' } | { tipo: 'error' } | { tipo: 'ok'; cuentas: Cuenta[]; total: number };

const PAGE_SIZE = 10;

@Component({
  selector: 'app-cuentas-page',
  standalone: true,
  imports: [LayoutConsultaComponent, ListaCuentasComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-layout-consulta titulo="Mis cuentas">
      @switch (estado().tipo) {
        @case ('cargando') { <p role="status">Cargando cuentas…</p> }
        @case ('error') {
          <p role="alert">No pudimos cargar tus cuentas.</p>
          <button type="button" (click)="cargar()">Reintentar</button>
        }
        @default {
          <app-lista-cuentas [cuentas]="cuentasActuales()" (seleccionar)="abrir($event)" />
          <nav aria-label="Paginación">
            <button type="button" class="secondary" [disabled]="pagina() <= 1" (click)="cambiarPagina(-1)">Anterior</button>
            <button type="button" class="secondary" [disabled]="!hayMas()" (click)="cambiarPagina(1)">Siguiente</button>
          </nav>
        }
      }
    </app-layout-consulta>
  `
})
export class CuentasPageComponent implements OnInit {
  private readonly api = inject(AccountsApi);
  private readonly router = inject(Router);

  readonly estado = signal<Estado>({ tipo: 'cargando' });
  readonly pagina = signal(1);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.estado.set({ tipo: 'cargando' });
    this.api.listar(this.pagina(), PAGE_SIZE).subscribe({
      next: (r) => this.estado.set({ tipo: 'ok', cuentas: r.items, total: r.total }),
      error: () => this.estado.set({ tipo: 'error' })
    });
  }

  cuentasActuales(): Cuenta[] {
    const e = this.estado();
    return e.tipo === 'ok' ? e.cuentas : [];
  }

  hayMas(): boolean {
    const e = this.estado();
    return e.tipo === 'ok' && this.pagina() * PAGE_SIZE < e.total;
  }

  cambiarPagina(delta: number): void {
    this.pagina.update((p) => p + delta);
    this.cargar();
  }

  abrir(id: string): void {
    void this.router.navigate(['/cuentas', id]);
  }
}
