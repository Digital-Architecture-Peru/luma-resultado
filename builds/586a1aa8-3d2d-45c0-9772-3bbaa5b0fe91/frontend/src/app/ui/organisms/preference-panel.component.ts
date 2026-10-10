import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EVENT_LABELS, EVENT_TYPES, EventType, Preference } from '../../core/models';
import { PreferenceToggleComponent } from '../molecules/preference-toggle.component';

/** Organismo: preferencias agrupadas por tipo de evento. */
@Component({
  selector: 'app-preference-panel',
  standalone: true,
  imports: [PreferenceToggleComponent],
  template: `
    @for (type of eventTypes; track type) {
      <fieldset>
        <legend>{{ label(type) }}</legend>
        @for (p of forEvent(type); track p.channel) {
          <app-preference-toggle [preference]="p" (changed)="changed.emit($event)" />
        }
      </fieldset>
    }
  `,
  styles: [
    `
      fieldset {
        margin: 0 0 var(--space-3);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
    `,
  ],
})
export class PreferencePanelComponent {
  @Input() preferences: Preference[] = [];
  @Output() changed = new EventEmitter<Preference>();

  readonly eventTypes = EVENT_TYPES;

  label(type: EventType): string {
    return EVENT_LABELS[type];
  }

  forEvent(type: EventType): Preference[] {
    return this.preferences.filter((p) => p.eventType === type);
  }
}
