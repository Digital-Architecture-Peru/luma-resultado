import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Muestra el número ya enmascarado por el backend (p. ej. ****1234). */
@Component({
  selector: 'app-numero-enmascarado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="numero" [attr.aria-label]="'Cuenta terminada en ' + ultimos">{{ value }}</span>`,
  styles: [`.numero { font-family: ui-monospace, monospace; letter-spacing: 0.05em; }`]
})
export class NumeroEnmascaradoComponent {
  @Input({ required: true }) value = '';

  get ultimos(): string {
    return this.value.replace(/\*/g, '');
  }
}
