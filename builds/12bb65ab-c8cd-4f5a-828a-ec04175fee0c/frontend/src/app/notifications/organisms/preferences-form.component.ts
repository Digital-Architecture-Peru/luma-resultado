import { Component, input, output } from '@angular/core';
import {
  CHANNELS,
  CHANNEL_LABELS,
  Channel,
  NOTIFICATION_TYPES,
  NotificationType,
  Preference,
  TYPE_LABELS,
} from '../data/models';

export interface PreferenceToggle {
  type: NotificationType;
  channel: Channel;
}

@Component({
  selector: 'app-preferences-form',
  standalone: true,
  template: `
    <form (submit)="$event.preventDefault(); save.emit()">
      <table class="prefs">
        <caption>Canales por tipo de notificación</caption>
        <thead>
          <tr>
            <th scope="col">Tipo</th>
            @for (c of channels; track c) {
              <th scope="col">{{ channelLabels[c] }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (t of types; track t) {
            <tr>
              <th scope="row">{{ typeLabels[t] }}</th>
              @for (c of channels; track c) {
                <td>
                  <input
                    type="checkbox"
                    [checked]="isEnabled(t, c)"
                    [attr.aria-label]="typeLabels[t] + ' por ' + channelLabels[c]"
                    (change)="toggled.emit({ type: t, channel: c })"
                  />
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
      <button type="submit" class="btn btn--primary" [disabled]="saving()">
        {{ saving() ? 'Guardando…' : 'Guardar preferencias' }}
      </button>
    </form>
  `,
})
export class PreferencesFormComponent {
  readonly preferences = input.required<Preference[]>();
  readonly saving = input(false);
  readonly toggled = output<PreferenceToggle>();
  readonly save = output<void>();

  protected readonly types = NOTIFICATION_TYPES;
  protected readonly channels = CHANNELS;
  protected readonly typeLabels = TYPE_LABELS;
  protected readonly channelLabels = CHANNEL_LABELS;

  protected isEnabled(type: NotificationType, channel: Channel): boolean {
    return this.preferences().some((p) => p.type === type && p.channel === channel && p.enabled);
  }
}
