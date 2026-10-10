import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToggleComponent } from '../atoms/toggle.component';
import { NotificationPreferences, PreferencesUpdate } from '../models/notification.model';

/** Organismo: formulario de preferencias de notificación. */
@Component({
  selector: 'app-preferences-panel',
  standalone: true,
  imports: [ToggleComponent],
  template: `
    <form class="panel" (submit)="submit($event)">
      <h2>Preferencias</h2>
      <label class="field">
        <span>Avisar cuando el saldo sea menor o igual a</span>
        <input type="number" min="0" step="0.01" [value]="threshold" (input)="onThreshold($event)" />
      </label>
      <app-toggle label="Avisar depósitos" [checked]="deposit" (changed)="deposit = $event" />
      <app-toggle label="Avisar retiros" [checked]="withdrawal" (changed)="withdrawal = $event" />
      @if (invalid) {
        <p role="alert" class="error">Ingresa un umbral válido (0 o mayor).</p>
      }
      <button type="submit" [disabled]="saving">Guardar preferencias</button>
    </form>
  `,
  styles: [`
    .panel { display: grid; gap: var(--space-3); background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-md); padding: var(--space-4); }
    h2 { margin: 0; font-size: 1.1rem; }
    .field { display: grid; gap: var(--space-1); }
    input[type=number] { min-height: 40px; padding: 0 var(--space-2); border: 1px solid var(--border);
      border-radius: var(--radius-md); background: var(--bg); color: var(--text); font: inherit; }
    .error { color: var(--danger); margin: 0; }
  `],
})
export class PreferencesPanelComponent {
  @Input() saving = false;
  @Output() save = new EventEmitter<PreferencesUpdate>();

  threshold = 100;
  deposit = true;
  withdrawal = true;
  invalid = false;

  @Input() set preferences(value: NotificationPreferences | null) {
    if (value) {
      this.threshold = value.lowBalanceThreshold;
      this.deposit = value.depositEnabled;
      this.withdrawal = value.withdrawalEnabled;
    }
  }

  onThreshold(event: Event): void {
    this.threshold = Number((event.target as HTMLInputElement).value);
  }

  submit(event: Event): void {
    event.preventDefault();
    this.invalid = !Number.isFinite(this.threshold) || this.threshold < 0;
    if (this.invalid) {
      return;
    }
    this.save.emit({
      lowBalanceThreshold: this.threshold,
      depositEnabled: this.deposit,
      withdrawalEnabled: this.withdrawal,
    });
  }
}
