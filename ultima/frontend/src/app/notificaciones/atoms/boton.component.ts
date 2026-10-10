import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-boton',
  standalone: true,
  template: `<button type="button" class="btn" [disabled]="disabled" (click)="pulsado.emit()">{{ etiqueta }}</button>`,
  styles: [`
    .btn { min-height: 40px; padding: 0 var(--space-4); border: 0; border-radius: var(--radius-md);
           background: var(--primary); color: var(--primary-contrast); font: inherit; cursor: pointer; }
    .btn:disabled { opacity: .5; cursor: not-allowed; }
  `]
})
export class BotonComponent {
  @Input({ required: true }) etiqueta = '';
  @Input() disabled = false;
  @Output() readonly pulsado = new EventEmitter<void>();
}
