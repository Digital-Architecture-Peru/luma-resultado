import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movement, Page } from '../core/models';
import { MovementRowComponent } from '../molecules/movement-row.component';

@Component({
  selector: 'app-movement-table',
  standalone: true,
  imports: [MovementRowComponent],
  template: `
    @if (data.items.length === 0) {
      <p class="state">Sin movimientos.</p>
    } @else {
      <div class="table-wrap">
        <table>
          <caption class="state">Movimientos</caption>
          <thead>
            <tr><th scope="col">Fecha</th><th scope="col">Descripción</th><th scope="col" class="num">Monto</th></tr>
          </thead>
          <tbody>
            @for (m of data.items; track m.id) {
              <tr app-movement-row [movement]="m"></tr>
            }
          </tbody>
        </table>
      </div>
      <nav class="pager" aria-label="Paginación de movimientos">
        <button type="button" [disabled]="data.page <= 1" (click)="pageChange.emit(data.page - 1)">Anterior</button>
        <span>Página {{ data.page }} de {{ totalPages }}</span>
        <button type="button" [disabled]="data.page >= totalPages" (click)="pageChange.emit(data.page + 1)">Siguiente</button>
      </nav>
    }
  `,
})
export class MovementTableComponent {
  @Input({ required: true }) data!: Page<Movement>;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.data.total / this.data.size));
  }
}
