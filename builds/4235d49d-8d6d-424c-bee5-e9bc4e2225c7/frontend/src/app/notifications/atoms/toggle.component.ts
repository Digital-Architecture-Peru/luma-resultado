import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Átomo: interruptor accesible basado en checkbox con etiqueta asociada. */
@Component({
  selector: 'app-toggle',
  standalone: true,
  template: `
    <label class="toggle">
      <input type="checkbox" [checked]="checked" (change)="onChange($event)" />
      <span>{{ label }}</span>
    </label>
  `,
  styles: [`
    .toggle { display: inline-flex; align-items: center; gap: var(--space-2); min-height: 40px; cursor: pointer; }
    input { width: 20px; height: 20px; }
  `],
})
export class ToggleComponent {
  @Input({ required: true }) label!: string;
  @Input() checked = false;
  @Output() changed = new EventEmitter<boolean>();

  onChange(event: Event): void {
    this.changed.emit((event.target as HTMLInputElement).checked);
  }
}
