import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    @if (message) {
      <p class="alert" [class.error]="kind === 'error'" [attr.role]="kind === 'error' ? 'alert' : 'status'">
        {{ message }}
      </p>
    }
  `,
  styles: [`
    .alert { padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--success); color: var(--success); }
    .alert.error { border-color: var(--danger); color: var(--danger); }
  `],
})
export class AppAlertComponent {
  @Input() message: string | null = null;
  @Input() kind: 'success' | 'error' = 'success';
}
