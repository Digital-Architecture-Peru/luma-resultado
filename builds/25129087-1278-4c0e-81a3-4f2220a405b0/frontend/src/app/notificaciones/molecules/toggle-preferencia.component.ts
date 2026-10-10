import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-preferencia',
  standalone: true,
  template: `
    <label class="toggle">
      <input type="checkbox" [checked]="habilitada" (change)="cambio.emit($any($event.target).checked)" />
      {{ etiqueta }}
    </label>
  `,
  styles: [`.toggle { display: flex; gap: var(--space-2); align-items: center; min-height: 40px; }`]
})
export class TogglePreferenciaComponent {
  @Input({ required: true }) etiqueta = '';
  @Input() habilitada = false;
  @Output() readonly cambio = new EventEmitter<boolean>();
}
