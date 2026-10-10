import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, switchMap, timer } from 'rxjs';
import { POLL_INTERVAL_MS, PaymentNotification, Preference } from '../core/models';
import { NotificationService } from '../core/notification.service';
import { NotificationListComponent } from '../ui/organisms/notification-list.component';
import { PreferencePanelComponent } from '../ui/organisms/preference-panel.component';
import { NotificationsLayoutComponent } from '../ui/templates/notifications-layout.component';

/** Página: único punto que conecta servicios con los componentes presentacionales. */
@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationsLayoutComponent, NotificationListComponent, PreferencePanelComponent],
  template: `
    <app-notifications-layout title="Notificaciones de pagos">
      <app-notification-list
        slot="list"
        [items]="items()"
        [loading]="loading()"
        [error]="error()"
        (markRead)="markRead($event)"
      />
      <app-preference-panel slot="preferences" [preferences]="preferences()" (changed)="updatePreference($event)" />
    </app-notifications-layout>
  `,
})
export class NotificationsPage {
  private readonly service = inject(NotificationService);

  readonly items = signal<PaymentNotification[]>([]);
  readonly preferences = signal<Preference[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    timer(0, POLL_INTERVAL_MS)
      .pipe(
        switchMap(() =>
          this.service.list().pipe(
            catchError(() => {
              this.loading.set(false);
              this.error.set('No se pudieron cargar las notificaciones.');
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((page) => {
        this.items.set(page.items);
        this.error.set(null);
        this.loading.set(false);
      });

    this.service
      .getPreferences()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (prefs) => this.preferences.set(prefs),
        error: () => this.error.set('No se pudieron cargar las preferencias.'),
      });
  }

  markRead(id: string): void {
    this.service.markRead(id).subscribe({
      next: (updated) =>
        this.items.update((list) => list.map((n) => (n.id === updated.id ? updated : n))),
      error: () => this.error.set('No se pudo marcar la notificación como leída.'),
    });
  }

  updatePreference(preference: Preference): void {
    this.service.updatePreferences([preference]).subscribe({
      next: (all) => this.preferences.set(all),
      error: () => this.error.set('No se pudo guardar la preferencia.'),
    });
  }
}
