import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button
    class="btn"
    [class.btn--secondary]="variant === 'secondary'"
    [type]="type"
    [disabled]="disabled">{{ label }}</button>`
})
export class ButtonComponent {
  @Input({ required: true }) label!: string;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
}
