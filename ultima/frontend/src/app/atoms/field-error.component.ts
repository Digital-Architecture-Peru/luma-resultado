import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  standalone: true,
  template: `@if (message) {
    <p class="field-error" role="alert" [id]="errorId">{{ message }}</p>
  }`,
})
export class FieldErrorComponent {
  @Input() message: string | null = null;
  @Input() errorId = '';
}
