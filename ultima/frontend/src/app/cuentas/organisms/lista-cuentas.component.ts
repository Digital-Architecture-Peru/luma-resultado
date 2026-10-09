import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Cuenta } from '../models/cuenta.model';
import { TarjetaCuentaComponent } from '../molecules/tarjeta-cuenta.component';

/** Organism: colección de tarjetas con estado vacío. */
@Component({
  selector: 'app-lista-cuentas',
  standalone: true,
  imports: [TarjetaCuentaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cuentas.length === 0) {
      <p class="vacio">No se encontraron cuentas.</p>
    } @else {
      <ul class="rejilla">
        @for (c of cuentas; track c.id) {
          <li><app-tarjeta-cuenta [cuenta]="c" (seleccionar)="seleccionar.emit($event)" /></li>
        }
      </ul>
    }
  `,
  styles: [`
    .rejilla { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-4);
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
    .vacio { color: var(--muted); }
  `]
})
export class ListaCuentasComponent {
  @Input({ required: true }) cuentas: Cuenta[] = [];
  @Output() readonly seleccionar = new EventEmitter<Cuenta>();
}
