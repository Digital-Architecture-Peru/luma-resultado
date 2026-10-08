import { Component, Input } from '@angular/core';
import { CardStatus } from '../core/models';

const LABELS: Record<CardStatus, string> = {
  Active: 'Activa',
  Blocked: 'Bloqueada',
  Expired: 'Vencida',
};

@Component({
  selector: 'app-badge-status',
  standalone: true,
  template: `<span [class]="'badge badge--' + status.toLowerCase()">{{ label }}</span>`,
})
export class BadgeStatusComponent {
  @Input({ required: true }) status!: CardStatus;

  get label(): string {
    return LABELS[this.status];
  }
}
