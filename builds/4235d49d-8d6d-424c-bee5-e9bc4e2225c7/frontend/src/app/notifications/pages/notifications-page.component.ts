import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AccountNotification,
  NotificationPreferences,
  PreferencesUpdate,
  StatusFilter,
} from '../models/notification.model';
import { NotificationApiService } from '../services/notification-api.service';
import { NotificationsLayoutComponent } from '../templates/notifications-layout.component';
import { NotificationListComponent } from '../organisms/notification-list.component';
import { PreferencesPanelComponent } from '../organisms/preferences-panel.component';

/** Cuenta ficticia de demostración; la real la provee la sesión de Banca por Internet. */
const DEMO_ACCOUNT_ID = '10001234';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationsLayoutComponent, NotificationListComponent, PreferencesPanelComponent],
  template: `
    <app-notifications-layout>
      <div slot="header">
        <button type="button" class="secondary" (click)="setFilter(filter() === 'ALL' ? 'UNREAD' : 'ALL')">
          {{ filter() === 'ALL' ? 'Ver solo no leídas' : 'Ver todas' }}
        </button>
      </div>
      <div slot="main">
        @if (error()) { <p role="alert" class="error">{{ error() }}</p> }
        @if (loading()) {
          <p role="status">Cargando notificaciones…</p>
        } @else {
          <app-notification-list [items]="items()" (markRead)="markRead($event)" />
        }
      </div>
      <div slot="aside">
        <app-preferences-panel [preferences]="preferences()" [saving]="saving()" (save)="savePreferences($event)" />
        @if (message()) { <p role="status">{{ message() }}</p> }
      </div>
    </app-notifications-layout>
  `,
  styles: [`.error { color: var(--danger); }`],
})
export class NotificationsPageComponent implements OnInit {
  private readonly api = inject(NotificationApiService);

  readonly items = signal<AccountNotification[]>([]);
  readonly preferences = signal<NotificationPreferences | null>(null);
  readonly filter = signal<StatusFilter>('ALL');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly message = signal('');

  ngOnInit(): void {
    this.load();
    this.api.getPreferences(DEMO_ACCOUNT_ID).subscribe({
      next: (p) => this.preferences.set(p),
      error: () => this.error.set('No se pudieron cargar las preferencias.'),
    });
  }

  setFilter(filter: StatusFilter): void {
    this.filter.set(filter);
    this.load();
  }

  markRead(id: string): void {
    this.api.markRead(id).subscribe({
      next: (updated) => {
        this.items.update((list) =>
          this.filter() === 'UNREAD'
            ? list.filter((n) => n.id !== updated.id)
            : list.map((n) => (n.id === updated.id ? updated : n)),
        );
      },
      error: () => this.error.set('No se pudo marcar la notificación como leída.'),
    });
  }

  savePreferences(update: PreferencesUpdate): void {
    this.saving.set(true);
    this.message.set('');
    this.api.updatePreferences(DEMO_ACCOUNT_ID, update).subscribe({
      next: (p) => {
        this.preferences.set(p);
        this.saving.set(false);
        this.message.set('Preferencias guardadas.');
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudieron guardar las preferencias.');
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.list(DEMO_ACCOUNT_ID, this.filter()).subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar las notificaciones.');
      },
    });
  }
}
