import { Component, Input } from '@angular/core';

export type BadgeTone = 'success' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: '<span [class]="\'badge badge--\' + tone">{{ label }}</span>',
})
export class BadgeComponent {
  @Input({ required: true }) label!: string;
  @Input() tone: BadgeTone = 'neutral';
}
