import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-action-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="btn"
      [class.btn--primary]="primary()"
      [disabled]="disabled()"
      [attr.aria-pressed]="pressed()"
      [attr.aria-label]="ariaLabel() || null"
      (click)="activated.emit()"
    >
      {{ label() }}
    </button>
  `,
})
export class ActionButtonComponent {
  readonly label = input.required<string>();
  readonly ariaLabel = input<string>('');
  readonly primary = input(false);
  readonly disabled = input(false);
  readonly pressed = input<boolean | null>(null);
  readonly activated = output<void>();
}
