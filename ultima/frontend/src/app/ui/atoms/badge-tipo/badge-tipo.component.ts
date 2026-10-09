import { Component, input } from '@angular/core';
import { claseTipo, etiquetaTipo, TipoNotificacion } from '../../../core/models/notificacion.model';

/** Átomo: etiqueta con el tipo de notificación (texto + color). */
@Component({
  selector: 'app-badge-tipo',
  standalone: true,
  template: '<span class="badge" [class]="clase()">{{ etiqueta() }}</span>',
  styles: [
    `
      .badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 999px;
        font-size: 0.75rem; font-weight: 600; background: #e5e7eb; color: #111827; }
      .tipo-consumo { background: #dbeafe; color: #1e3a8a; }
      .tipo-vencimiento { background: #fef3c7; color: #78350f; }
      .tipo-bloqueo { background: #fee2e2; color: #7f1d1d; }
      .tipo-pago-recibido { background: #dcfce7; color: #14532d; }
    `,
  ],
})
export class BadgeTipoComponent {
  readonly tipo = input.required<TipoNotificacion>();

  etiqueta(): string {
    return etiquetaTipo(this.tipo());
  }

  clase(): string {
    return `badge ${claseTipo(this.tipo())}`;
  }
}
