import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" [disabled]="disabled()" (click)="pressed.emit()"><ng-content /></button>`,
  styles: `
    button { min-height: 40px; padding: 0 var(--space-4); border: 1px solid var(--primary);
      border-radius: var(--radius-md); background: var(--primary); color: var(--primary-contrast);
      font: inherit; cursor: pointer; transition: opacity var(--dur-fast); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `,
})
export class ButtonComponent {
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
