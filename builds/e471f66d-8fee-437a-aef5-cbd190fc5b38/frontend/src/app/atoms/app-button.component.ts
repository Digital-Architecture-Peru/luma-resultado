import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button class="btn" [class.btn-secondary]="variant === 'secondary'" [type]="type" [disabled]="disabled">
    <ng-content />
  </button>`,
})
export class AppButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
}
