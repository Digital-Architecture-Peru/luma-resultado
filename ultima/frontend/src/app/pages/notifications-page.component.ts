import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, forkJoin, merge, switchMap, tap, timer } from 'rxjs';
import { PaymentNotification } from '../core/models/payment-notification.model';
import { PaymentNotificationService } from '../core/services/payment-notification.service';
import { NotificationBellComponent } from '../organisms/notification-bell.component';
import { NotificationListComponent } from '../organisms/notification-list.component';
import { NotificationsLayoutComponent } from '../templates/notifications-layout.component';

export const POLL_INTERVAL_MS = 30_000;
type Filter = 'ALL' | 'UNREAD';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationsLayoutComponent, NotificationBellComponent, NotificationListComponent],
  template: `
    <app-notifications-layout>
      <app-notification-bell slot="bell" [count]="unreadCount()" />
      <div class="filters" role="group" aria-label="Filtro de notificaciones">
        <button type="button" class="btn" [attr.aria-pressed]="filter() === 'ALL'" (click)="setFilter('ALL')">
          Todas
        </button>
        <button type="button" class="btn" [attr.aria-pressed]="filter() === 'UNREAD'" (click)="setFilter('UNREAD')">
          No leídas
        </button>
      </div>
      <app-notification-list
        [items]="items()"
        [loading]="loading()"
        [error]="error()"
        (markRead)="markRead($event)"
      />
    </app-notifications-layout>
  `,
})
export class NotificationsPageComponent {
  private readonly service = inject(PaymentNotificationService);
  private readonly refresh$ = new Subject<void>();

  readonly items = signal<PaymentNotification[]>([]);
  readonly unreadCount = signal(0);
  readonly filter = signal<Filter>('ALL');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    merge(timer(0, POLL_INTERVAL_MS), this.refresh$)
      .pipe(
        switchMap(() =>
          forkJoin({
            page: this.service.list(this.filter() === 'UNREAD' ? 'UNREAD' : undefined),
            unread: this.service.list('UNREAD', 0, 1),
          }).pipe(
            catchError(() => {
              this.error.set('No se pudieron cargar las notificaciones.');
              this.loading.set(false);
              return EMPTY;
            }),
          ),
        ),
        tap(() => this.error.set(null)),
        takeUntilDestroyed(),
      )
      .subscribe(({ page, unread }) => {
        this.items.set(page.items);
        this.unreadCount.set(unread.total);
        this.loading.set(false);
      });
  }

  setFilter(filter: Filter): void {
    this.filter.set(filter);
    this.loading.set(true);
    this.refresh$.next();
  }

  markRead(id: string): void {
    this.service.markAsRead(id).subscribe({
      next: () => this.refresh$.next(),
      error: () => this.error.set('No se pudo marcar la notificación como leída.'),
    });
  }
}
