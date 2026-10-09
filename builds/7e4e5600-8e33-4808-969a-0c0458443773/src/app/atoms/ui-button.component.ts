import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Átomo: botón con variantes. */
@Component({
  selector: 'ui-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button [attr.type]="type()" [disabled]="disabled()" [class]="'btn btn-' + variant()">
    <ng-content />
  </button>`,
})
export class UiButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly disabled = input(false);
}
