import { Component, Input } from '@angular/core';
import { Cuenta } from '../../../features/cuentas/models/cuenta.model';
import { CuentaCardComponent } from '../../molecules/cuenta-card/cuenta-card.component';

/** Organismo: colección de tarjetas con estado vacío. */
@Component({
  selector: 'app-cuentas-lista',
  standalone: true,
  imports: [CuentaCardComponent],
  template: `
    @if (cuentas.length === 0) {
      <p class="mensaje">No hay cuentas para mostrar.</p>
    } @else {
      <ul class="cuentas-lista">
        @for (cuenta of cuentas; track cuenta.id) {
          <li><app-cuenta-card [cuenta]="cuenta" /></li>
        }
      </ul>
    }
  `,
})
export class CuentasListaComponent {
  @Input() cuentas: Cuenta[] = [];
}
