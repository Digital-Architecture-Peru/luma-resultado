import { Component, Input } from '@angular/core';
import { NotificationType } from '../core/models/payment-notification.model';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg class="icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      @switch (type) {
        @case ('PAGO_EXITOSO') {
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" stroke-width="2" />
        }
        @case ('PAGO_RECHAZADO') {
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="currentColor" stroke-width="2" />
        }
        @default {
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  @Input({ required: true }) type!: NotificationType;
}
