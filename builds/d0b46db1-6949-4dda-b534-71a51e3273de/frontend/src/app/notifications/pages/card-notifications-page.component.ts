import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NotificationApiService } from '../data/notification-api.service';
import { CardNotification } from '../data/notification.model';
import { NotificationBellComponent } from '../organisms/notification-bell.component';
import { NotificationListComponent } from '../organisms/notification-list.component';
import { NotificationsLayoutComponent } from '../templates/notifications-layout.component';

const DEMO_CARD_REF = 'CARD-TOK-0001';

@Component({
  selector: 'app-card-notifications-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationsLayoutComponent, NotificationBellComponent, NotificationListComponent],
  template: `
    <app-notifications-layout>
      <ng-container slot="header">
        <h1>Notificaciones de tu tarjeta</h1>
        <app-notification-bell [count]="unread()" />
      </ng-container>
      <label class="filter">
        <input type="checkbox" [checked]="onlyUnread()" (change)="toggleUnread($event)" />
        Mostrar solo nuevas
      </label>
      <app-notification-list
        [items]="items()"
        [loading]="loading()"
        [error]="error()"
        (markRead)="markRead($event)"
      />
    </app-notifications-layout>
  `,
  styles: `
    .filter { display: inline-flex; gap: var(--space-2); margin-block-end: var(--space-3); }
  `,
})
export class CardNotificationsPageComponent implements OnInit {
  private readonly api = inject(NotificationApiService);

  protected readonly items = signal<readonly CardNotification[]>([]);
  protected readonly unread = signal(0);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly onlyUnread = signal(false);

  ngOnInit(): void {
    this.reload();
  }

  protected toggleUnread(event: Event): void {
    this.onlyUnread.set((event.target as HTMLInputElement).checked);
    this.reload();
  }

  protected markRead(id: string): void {
    this.api.markAsRead(id).subscribe({
      next: () => this.reload(),
      error: () => this.error.set('No se pudo marcar la notificación como leída.'),
    });
  }

  private reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.list(DEMO_CARD_REF, this.onlyUnread() ? 'UNREAD' : undefined).subscribe({
      next: (page) => {
        this.items.set(page.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las notificaciones. Intenta nuevamente.');
        this.loading.set(false);
      },
    });
    this.api.unreadCount().subscribe({ next: (r) => this.unread.set(r.count) });
  }
}
