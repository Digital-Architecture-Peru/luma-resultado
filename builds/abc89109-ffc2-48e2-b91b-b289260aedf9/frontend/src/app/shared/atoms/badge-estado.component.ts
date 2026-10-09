import { Component, Input } from '@angular/core';
import { EstadoCuenta } from '../../core/cuenta.model';

@Component({
  selector: 'app-badge-estado',
  standalone: true,
  template: '<span class="badge" [class]="\'badge \' + estado.toLowerCase()">{{ estado }}</span>',
  styles: [
    `.badge { display: inline-block; padding: 0.1rem 0.6rem; border-radius: 999px; border: 1px solid currentColor; font-size: 0.8rem; font-weight: 600; }
     .activa { color: var(--success); }
     .bloqueada { color: var(--warning); }
     .cerrada { color: var(--muted); }`,
  ],
})
export class BadgeEstadoComponent {
  @Input({ required: true }) estado: EstadoCuenta = 'ACTIVA';
}
