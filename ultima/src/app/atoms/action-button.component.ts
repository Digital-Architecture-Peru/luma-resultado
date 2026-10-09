import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'app-action-button',
  standalone: true,
  template: `<button
    type="button"
    [class]="'btn btn--' + variant"
    [disabled]="disabled"
    [attr.aria-pressed]="pressed === null ? null : pressed"
    (click)="activated.emit()"
  >{{ label }}</button>`,
})
export class ActionButtonComponent {
  @Input() label = '';
  @Input() variant: ButtonVariant = 'secondary';
  @Input() disabled = false;
  @Input() pressed: boolean | null = null;
  @Output() readonly activated = new EventEmitter<void>();
}
