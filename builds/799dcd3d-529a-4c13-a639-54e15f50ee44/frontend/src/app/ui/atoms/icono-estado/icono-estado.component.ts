import { Component, input } from '@angular/core';

/** Átomo: indicador de leída / no leída (no depende solo del color). */
@Component({
  selector: 'app-icono-estado',
  standalone: true,
  template: `
    <span class="estado" [class.pendiente]="!leida()" role="img" [attr.aria-label]="texto()">
      {{ leida() ? '○' : '●' }}
    </span>
  `,
  styles: [
    `
      .estado { color: #6b7280; font-size: 0.875rem; }
      .pendiente { color: #1d4ed8; }
    `,
  ],
})
export class IconoEstadoComponent {
  readonly leida = input.required<boolean>();

  texto(): string {
    return this.leida() ? 'Leída' : 'No leída';
  }
}
