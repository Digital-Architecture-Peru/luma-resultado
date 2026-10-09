import { Component, computed, input } from '@angular/core';
import { CardStatus } from '../../domain/card';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class.badge-ok]="active()" [class.badge-off]="!active()">{{ text() }}</span>`,
})
export class StatusBadgeComponent {
  readonly status = input.required<CardStatus>();
  readonly active = computed(() => this.status() === 'ACTIVE');
  readonly text = computed(() => (this.active() ? '✔ Activa' : '✖ Bloqueada'));
}
