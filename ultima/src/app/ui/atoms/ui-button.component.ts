import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button class="btn" [class.btn-primary]="variant() === 'primary'" [type]="type()" [disabled]="disabled()">
      {{ label() }}
    </button>
  `,
})
export class UiButtonComponent {
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly disabled = input(false);
}
