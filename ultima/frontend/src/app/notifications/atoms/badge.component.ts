import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    @if (count > 0) {
      <span class="badge" role="status" [attr.aria-label]="count + ' notificaciones sin leer'">{{ label }}</span>
    }
  `,
  styles: [
    `.badge { display: inline-block; min-width: 1.5rem; padding: 0 var(--space-2); border-radius: 999px;
      background: var(--danger); color: var(--primary-contrast); text-align: center; font-size: 0.8rem; }`
  ]
})
export class BadgeComponent {
  @Input() count = 0;

  get label(): string {
    return this.count > 99 ? '99+' : String(this.count);
  }
}
