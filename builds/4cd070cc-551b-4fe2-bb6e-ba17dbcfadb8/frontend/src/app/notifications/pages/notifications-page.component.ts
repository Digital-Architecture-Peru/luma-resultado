import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccountNotification, NotificationStatusFilter } from '../data/models';
import { NotificationService } from '../data/notification.service';
import { NotificationListComponent } from '../organisms/notification-list.component';
import { NotificationsTemplateComponent } from '../templates/notifications-template.component';

type LoadState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationsTemplateComponent, NotificationListComponent],
  template: `
    <app-notifications-template [unread]="unread">
      <div actions>
        <button type="button" class="secondary" (click)="setFilter(filter === 'all' ? 'unread' : 'all')">
          {{ filter === 'all' ? 'Ver solo sin leer' : 'Ver todas' }}
        </button>
        <button type="button" (click)="load()">Actualizar</button>
      </div>
      @switch (state) {
        @case ('loading') { <p role="status">Cargando…</p> }
        @case ('error') { <p role="alert">No se pudieron cargar las notificaciones.</p> }
        @default { <app-notification-list [items]="items" (markRead)="onMarkRead($event)" /> }
      }
    </app-notifications-template>
  `
})
export class NotificationsPageComponent implements OnInit {
  private readonly service = inject(NotificationService);
  private readonly accountId = environment.demoAccountId;

  items: AccountNotification[] = [];
  unread = 0;
  filter: NotificationStatusFilter = 'all';
  state: LoadState = 'loading';

  ngOnInit(): void {
    this.load();
  }

  setFilter(filter: NotificationStatusFilter): void {
    this.filter = filter;
    this.load();
  }

  load(): void {
    this.state = 'loading';
    forkJoin({
      page: this.service.list(this.accountId, this.filter),
      count: this.service.unreadCount(this.accountId)
    }).subscribe({
      next: ({ page, count }) => {
        this.items = page.items;
        this.unread = count;
        this.state = 'ready';
      },
      error: () => (this.state = 'error')
    });
  }

  onMarkRead(id: string): void {
    this.service.markRead(id).subscribe({
      next: () => this.load(),
      error: () => (this.state = 'error')
    });
  }
}
