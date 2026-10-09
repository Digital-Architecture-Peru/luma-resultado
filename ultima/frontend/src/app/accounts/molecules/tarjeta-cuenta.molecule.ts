import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Cuenta } from '../data/account.model';
import { BadgeEstadoComponent } from '../atoms/badge-estado.atom';
import { MontoComponent } from '../atoms/monto.atom';
import { NumeroEnmascaradoComponent } from '../atoms/numero-enmascarado.atom';

@Component({
  selector: 'app-tarjeta-cuenta',
  standalone: true,
  imports: [BadgeEstadoComponent, MontoComponent, NumeroEnmascaradoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="tarjeta">
      <header>
        <h3>{{ cuenta.productType }}</h3>
        <app-badge-estado [estado]="cuenta.status" />
      </header>
      <app-numero-enmascarado [value]="cuenta.maskedNumber" />
      <p class="saldo">
        Saldo disponible
        <app-monto [value]="cuenta.availableBalance" [currency]="cuenta.currency" />
      </p>
      <button type="button" class="secondary" (click)="seleccionar.emit(cuenta.id)">Ver detalle</button>
    </article>
  `,
  styles: [
    `
      .tarjeta { display: grid; gap: var(--space-3); padding: var(--space-4); background: var(--surface);
        border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
      header { display: flex; justify-content: space-between; align-items: center; gap: var(--space-2); }
      h3 { margin: 0; font-size: 1.05rem; }
      .saldo { margin: 0; display: grid; color: var(--muted); }
    `
  ]
})
export class TarjetaCuentaComponent {
  @Input({ required: true }) cuenta!: Cuenta;
  @Output() seleccionar = new EventEmitter<string>();
}
