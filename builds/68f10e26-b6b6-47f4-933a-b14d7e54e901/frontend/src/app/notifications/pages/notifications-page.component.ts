import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, interval } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification, StatusFilter } from '../data/models';
import { NotificationService } from '../data/notification.service';
import { NotificationPanelComponent } from '../organisms/notification-panel.component';
import { NotificationsLayoutComponent } from '../templates/notifications-layout.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationsLayoutComponent, NotificationPanelComponent],
  template: `
    <app-notifications-layout [unreadCount]="unread()">
      <app-notification-panel
        [items]="items()"
        [loading]="loading()"
        [error]="error()"
        [filter]="filter()"
        (filterChange)="setFilter($event)"
        (markRead)="markRead($event)"
        (retry)="refresh()"
      />
    </app-notifications-layout>
  `,
})
export class NotificationsPageComponent implements OnInit {
  private readonly service = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = signal<AppNotification[]>([]);
  readonly unread = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filter = signal<StatusFilter>('ALL');

  ngOnInit(): void {
    this.refresh();
    // D6: polling con intervalo configurable; unread-count es un endpoint ligero.
    interval(environment.pollIntervalMs)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refresh(false));
  }

  setFilter(filter: StatusFilter): void {
    this.filter.set(filter);
    this.refresh();
  }

  markRead(id: string): void {
    this.service.markRead(id).subscribe({
      next: () => this.refresh(false),
      error: () => this.error.set('No se pudo marcar la notificación como leída.'),
    });
  }

  refresh(showLoading = true): void {
    if (showLoading) this.loading.set(true);
    forkJoin({ items: this.service.list(this.filter()), unread: this.service.unreadCount() }).subscribe({
      next: ({ items, unread }) => {
        this.items.set(items);
        this.unread.set(unread);
        this.error.set(null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las notificaciones. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }
}
