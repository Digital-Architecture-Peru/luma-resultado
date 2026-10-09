import { Component, Input } from '@angular/core';
import { CuentaResumen } from '../../core/cuenta.model';
import { CuentaItemComponent } from '../molecules/cuenta-item.component';

@Component({
  selector: 'app-lista-cuentas',
  standalone: true,
  imports: [CuentaItemComponent],
  template: `
    @if (cuentas.length === 0) {
      <p class="vacio">No se encontraron cuentas para este cliente.</p>
    } @else {
      <ul class="lista">
        @for (cuenta of cuentas; track cuenta.id) {
          <li><app-cuenta-item [cuenta]="cuenta" /></li>
        }
      </ul>
    }
  `,
  styles: [
    `.lista { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); }
     .vacio { color: var(--muted); }`,
  ],
})
export class ListaCuentasComponent {
  @Input({ required: true }) cuentas: CuentaResumen[] = [];
}
