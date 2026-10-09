import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button class="btn" [attr.type]="type" [disabled]="disabled"><ng-content /></button>`,
  styles: [`
    .btn {
      min-height: 2.5rem;
      padding: 0 var(--space-4);
      border: 0;
      border-radius: var(--radius-md);
      background: var(--primary);
      color: var(--primary-contrast);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .btn:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `],
})
export class AppButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
}
