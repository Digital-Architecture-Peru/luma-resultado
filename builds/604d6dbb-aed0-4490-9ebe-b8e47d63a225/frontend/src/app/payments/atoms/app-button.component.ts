import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type" [disabled]="disabled" [class.secondary]="variant === 'secondary'" (click)="pressed.emit()">
      {{ label }}
    </button>
  `,
  styles: [
    `
      button {
        min-height: 2.75rem;
        padding: var(--space-2) var(--space-6);
        border: 1px solid var(--primary);
        border-radius: var(--radius-md);
        background: var(--primary);
        color: var(--primary-contrast);
        font: inherit;
        font-weight: 600;
        cursor: pointer;
        transition: opacity var(--dur-fast);
      }
      button.secondary {
        background: transparent;
        color: var(--primary);
      }
      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
    `,
  ],
})
export class AppButtonComponent {
  @Input({ required: true }) label = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
  @Output() pressed = new EventEmitter<void>();
}
