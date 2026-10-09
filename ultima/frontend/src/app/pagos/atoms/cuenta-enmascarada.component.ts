import { Component, Input } from '@angular/core';

/** Atomo: muestra la cuenta ya enmascarada por el backend, con nombre accesible. */
@Component({
  selector: 'app-cuenta-enmascarada',
  standalone: true,
  template: `<span [attr.aria-label]="'Cuenta terminada en ' + ultimos">{{ valor }}</span>`,
})
export class CuentaEnmascaradaComponent {
  @Input({ required: true }) valor!: string;

  get ultimos(): string {
    return this.valor.replace(/\*/g, '');
  }
}
