import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Átomo: botón con variantes y estado deshabilitado. */
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button class="btn" [class.btn-secondary]="variant === 'secondary'" [type]="type" [disabled]="disabled">
    <ng-content />
  </button>`,
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
}
