import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn"
      [class.btn-secondary]="variant() === 'secondary'"
      [type]="type()"
      [disabled]="disabled()"
      (click)="pressed.emit()"
    >
      {{ label() }}
    </button>
  `,
})
export class AppButton {
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
