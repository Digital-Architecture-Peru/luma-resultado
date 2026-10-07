import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="btn" [attr.aria-label]="label()" (click)="pressed.emit()">
      <span aria-hidden="true">{{ icon() }}</span>
    </button>
  `,
  styles: `
    .btn { min-width: var(--tap); min-height: var(--tap); border: 0; border-radius: var(--radius);
      background: transparent; color: inherit; font-size: 1.4rem; cursor: pointer; }
  `,
})
export class IconButtonComponent {
  readonly label = input.required<string>();
  readonly icon = input<string>('←');
  readonly pressed = output<void>();
}
