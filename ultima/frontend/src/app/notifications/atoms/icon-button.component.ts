import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  template: `
    <button type="button" class="btn" [disabled]="disabled()" [attr.aria-label]="label()" (click)="pressed.emit()">
      <ng-content />
    </button>
  `,
})
export class IconButtonComponent {
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
