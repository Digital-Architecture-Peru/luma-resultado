import { Component, input } from '@angular/core';
import { NotificationType } from '../../../core/models';

/** Átomo: icono SVG por tipo de notificación (decorativo). */
@Component({
  selector: 'app-icon',
  template: `
    <svg class="icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      @switch (type()) {
        @case ('DEPOSIT') {
          <path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2" />
        }
        @case ('WITHDRAWAL') {
          <path d="M12 20V8m0 0-5 5m5-5 5 5M5 4h14" fill="none" stroke="currentColor" stroke-width="2" />
        }
        @default {
          <path d="M12 3 2 21h20L12 3Zm0 7v5m0 3v.01" fill="none" stroke="currentColor" stroke-width="2" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  readonly type = input.required<NotificationType>();
}
