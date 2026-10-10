import { Component, computed, input, output } from '@angular/core';
import { AccountNotification } from '../../../core/models';
import { NotificationItemComponent } from '../../molecules/notification-item/notification-item.component';

/** Organismo: lista paginada de notificaciones con estado vacío. */
@Component({
  selector: 'app-notification-list',
  imports: [NotificationItemComponent],
  template: `
    @if (items().length === 0) {
      <p class="empty">No tienes notificaciones para mostrar.</p>
    } @else {
      <ul class="list">
        @for (n of items(); track n.id) {
          <app-notification-item [notification]="n" (markRead)="markRead.emit($event)" />
        }
      </ul>
    }
    <nav class="pager" aria-label="Paginación">
      <button type="button" class="btn" [disabled]="page() === 0" (click)="pageChange.emit(page() - 1)">
        Anterior
      </button>
      <span>Página {{ page() + 1 }} de {{ pages() }}</span>
      <button
        type="button"
        class="btn"
        [disabled]="page() + 1 >= pages()"
        (click)="pageChange.emit(page() + 1)"
      >
        Siguiente
      </button>
    </nav>
  `,
})
export class NotificationListComponent {
  readonly items = input.required<AccountNotification[]>();
  readonly page = input.required<number>();
  readonly size = input.required<number>();
  readonly total = input.required<number>();

  readonly markRead = output<string>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => Math.max(1, Math.ceil(this.total() / this.size())));
}
