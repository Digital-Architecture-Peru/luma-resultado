import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../atoms/button.component';
import { AppNotification, StatusFilter } from '../data/models';
import { NotificationItemComponent } from '../molecules/notification-item.component';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [ButtonComponent, NotificationItemComponent],
  template: `
    <div class="tabs" role="group" aria-label="Filtrar notificaciones">
      @for (f of filters; track f.value) {
        <app-button [label]="f.label" [active]="filter === f.value" (pressed)="filterChange.emit(f.value)" />
      }
    </div>
    <div aria-live="polite">
      @if (loading) {
        <p class="state">Cargando notificaciones…</p>
      } @else if (error) {
        <p class="state state--error" role="alert">{{ error }}</p>
        <app-button label="Reintentar" (pressed)="retry.emit()" />
      } @else if (items.length === 0) {
        <p class="state">No tienes notificaciones.</p>
      } @else {
        <ul class="list">
          @for (n of items; track n.id) {
            <li><app-notification-item [notification]="n" (markRead)="markRead.emit($event)" /></li>
          }
        </ul>
      }
    </div>
  `,
  styles: [
    `.tabs{display:flex;gap:.5rem;margin-block-end:var(--space);flex-wrap:wrap}
     .list{list-style:none;margin:0;padding:0;display:grid;gap:.75rem}
     .state{padding:var(--space);color:var(--muted)} .state--error{color:var(--danger);font-weight:600}`,
  ],
})
export class NotificationPanelComponent {
  @Input() items: AppNotification[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() filter: StatusFilter = 'ALL';
  @Output() filterChange = new EventEmitter<StatusFilter>();
  @Output() markRead = new EventEmitter<string>();
  @Output() retry = new EventEmitter<void>();

  readonly filters: { value: StatusFilter; label: string }[] = [
    { value: 'ALL', label: 'Todas' },
    { value: 'UNREAD', label: 'No leídas' },
    { value: 'READ', label: 'Leídas' },
  ];
}
