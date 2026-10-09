import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-numero-enmascarado',
  standalone: true,
  template: `<span class="numero" [attr.aria-label]="etiqueta">{{ numero }}</span>`,
  styles: ['.numero { font-family: ui-monospace, monospace; letter-spacing: 0.05em; }'],
})
export class NumeroEnmascaradoComponent {
  @Input({ required: true }) numero = '';

  get ultimos(): string {
    return this.numero.replace(/\*/g, '');
  }

  get etiqueta(): string {
    return `Numero de cuenta terminado en ${this.ultimos}`;
  }
}
