import { Component, input, linkedSignal, output } from '@angular/core';
import { NotificationPreference, NotificationType } from '../../../core/models';
import { typeLabel } from '../../../core/notification-format';

/** Organismo: formulario de preferencias de notificación por tipo. */
@Component({
  selector: 'app-preferences-form',
  template: `
    <form class="prefs" (submit)="submit($event)">
      <h2>Preferencias</h2>
      @for (p of draft(); track p.type) {
        <div class="pref">
          <label [for]="'enabled-' + p.type">
            <input
              type="checkbox"
              [id]="'enabled-' + p.type"
              [checked]="p.enabled"
              (change)="onToggle(p.type, $event)"
            />
            {{ label(p.type) }}
          </label>
          @if (p.type === 'LOW_BALANCE') {
            <label [for]="'threshold-' + p.type">Umbral de saldo
              <input
                type="number"
                min="0"
                step="0.01"
                [id]="'threshold-' + p.type"
                [value]="p.threshold ?? ''"
                [disabled]="!p.enabled"
                (input)="onThreshold(p.type, $event)"
              />
            </label>
          }
        </div>
      }
      <button type="submit" class="btn primary" [disabled]="saving()">
        {{ saving() ? 'Guardando…' : 'Guardar preferencias' }}
      </button>
    </form>
  `,
})
export class PreferencesFormComponent {
  readonly preferences = input.required<NotificationPreference[]>();
  readonly saving = input(false);
  readonly save = output<NotificationPreference[]>();

  protected readonly draft = linkedSignal<NotificationPreference[]>(() => this.preferences());

  protected label(type: NotificationType): string {
    return typeLabel(type);
  }

  protected onToggle(type: NotificationType, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.patch(type, { enabled: checked });
  }

  protected onThreshold(type: NotificationType, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.patch(type, { threshold: raw === '' ? null : Number(raw) });
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.save.emit(this.draft());
  }

  private patch(type: NotificationType, change: Partial<NotificationPreference>): void {
    this.draft.update((list) => list.map((p) => (p.type === type ? { ...p, ...change } : p)));
  }
}
