import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CHANNEL_LABELS, Preference } from '../../core/models';

/** Molécula: interruptor de un canal para un tipo de evento. */
@Component({
  selector: 'app-preference-toggle',
  standalone: true,
  template: `
    <label class="toggle">
      <input type="checkbox" [checked]="preference.enabled" (change)="onChange($event)" />
      {{ channelLabel }}
    </label>
  `,
  styles: [
    `
      .toggle {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        min-block-size: 2.5rem;
        margin-inline-end: var(--space-4);
      }
    `,
  ],
})
export class PreferenceToggleComponent {
  @Input({ required: true }) preference!: Preference;
  @Output() changed = new EventEmitter<Preference>();

  get channelLabel(): string {
    return CHANNEL_LABELS[this.preference.channel];
  }

  onChange(event: Event): void {
    const enabled = (event.target as HTMLInputElement).checked;
    this.changed.emit({ ...this.preference, enabled });
  }
}
