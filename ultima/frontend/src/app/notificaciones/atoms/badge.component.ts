import { Component, Input } from '@angular/core';

/** Etiqueta de estado: el significado va en texto, no solo en color. */
@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [class.nuevo]="nuevo">{{ nuevo ? 'Nueva' : 'Leída' }}</span>`,
  styles: [`
    .badge { padding: 2px var(--space-2); border-radius: 999px; font-size: .8rem;
             border: 1px solid var(--border); color: var(--muted); }
    .badge.nuevo { border-color: var(--primary); color: var(--primary); font-weight: 600; }
  `]
})
export class BadgeComponent {
  @Input() nuevo = false;
}
