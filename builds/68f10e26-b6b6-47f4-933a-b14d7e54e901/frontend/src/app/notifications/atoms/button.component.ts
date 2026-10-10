import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button type="button" class="btn" [class.btn--active]="active" [attr.aria-pressed]="pressedState"
    [disabled]="disabled" (click)="pressed.emit()">{{ label }}</button>`,
  styles: [
    `.btn{min-block-size:2.5rem;padding:0 1rem;border-radius:var(--radius);border:1px solid var(--border);
      background:var(--surface);color:var(--text);font:inherit;cursor:pointer}
     .btn:hover:not(:disabled){background:var(--surface-alt)}
     .btn:focus-visible{outline:3px solid var(--primary);outline-offset:2px}
     .btn:disabled{opacity:.5;cursor:not-allowed}
     .btn--active{background:var(--primary);color:var(--primary-contrast);border-color:var(--primary)}`,
  ],
})
export class ButtonComponent {
  @Input({ required: true }) label!: string;
  @Input() disabled = false;
  /** Si se define, el botón se comporta como toggle (aria-pressed). */
  @Input() active: boolean | null = null;
  @Output() pressed = new EventEmitter<void>();

  get pressedState(): string | null {
    return this.active === null ? null : String(this.active);
  }
}
