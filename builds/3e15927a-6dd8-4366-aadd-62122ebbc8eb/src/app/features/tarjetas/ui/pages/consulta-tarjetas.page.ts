import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { TARJETAS_REPOSITORY } from '../../data/tarjetas.repository';
import { Tarjeta } from '../../domain/tarjeta.model';
import { MaskPanPipe } from '../../pipes/mask-pan.pipe';
import { ConsultaLayoutComponent } from '../templates/consulta-layout/consulta-layout.component';
import { ListaTarjetasComponent } from '../organisms/lista-tarjetas/lista-tarjetas.component';

export interface ConsultaVm {
  readonly cargando: boolean;
  readonly error: boolean;
  readonly tarjetas: readonly Tarjeta[];
}

const VM_CARGANDO: ConsultaVm = { cargando: true, error: false, tarjetas: [] };

@Component({
  selector: 'app-consulta-tarjetas-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MaskPanPipe, ConsultaLayoutComponent, ListaTarjetasComponent],
  template: `
    <app-consulta-layout titulo="Mis tarjetas">
      @if (vm$ | async; as vm) {
        @if (vm.cargando) {
          <p role="status">Cargando tarjetas…</p>
        } @else if (vm.error) {
          <div role="alert">
            <p>No pudimos consultar tus tarjetas. Intenta nuevamente.</p>
            <button type="button" (click)="reintentar()">Reintentar</button>
          </div>
        } @else if (vm.tarjetas.length === 0) {
          <p role="status">No tienes tarjetas para mostrar.</p>
        } @else {
          <app-lista-tarjetas [tarjetas]="vm.tarjetas" (seleccionar)="seleccionada = $event" />
        }
      }
      @if (seleccionada; as tarjeta) {
        <p class="seleccion" role="status">
          Seleccionaste {{ tarjeta.alias }} ({{ tarjeta.numero | maskPan }})
        </p>
      }
    </app-consulta-layout>
  `,
})
export class ConsultaTarjetasPage {
  private readonly repositorio = inject(TARJETAS_REPOSITORY);
  private readonly recarga$ = new BehaviorSubject<void>(undefined);

  seleccionada: Tarjeta | null = null;

  readonly vm$: Observable<ConsultaVm> = this.recarga$.pipe(
    switchMap(() =>
      this.repositorio.listar().pipe(
        map((tarjetas): ConsultaVm => ({ cargando: false, error: false, tarjetas })),
        catchError(() => of<ConsultaVm>({ cargando: false, error: true, tarjetas: [] })),
        startWith(VM_CARGANDO),
      ),
    ),
  );

  reintentar(): void {
    this.recarga$.next();
  }
}
