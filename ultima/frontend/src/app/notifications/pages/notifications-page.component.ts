import { Component, OnInit, inject } from '@angular/core';
import { NotificationsApi } from '../data/notifications.api';
import { NotificationsStore } from '../data/notifications.store';
import { NotificationsLayoutComponent } from '../templates/notifications-layout.component';
import { NotificationListComponent } from '../organisms/notification-list.component';
import { PreferencesFormComponent } from '../organisms/preferences-form.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationsLayoutComponent, NotificationListComponent, PreferencesFormComponent],
  providers: [
    {
      provide: NotificationsStore,
      useFactory: (api: NotificationsApi) => new NotificationsStore(api),
      deps: [NotificationsApi],
    },
  ],
  template: `
    <app-notifications-layout>
      <div toolbar class="toolbar">
        <span class="muted">Sin leer: {{ store.unreadCount() }}</span>
        <label class="toggle">
          <input
            type="checkbox"
            [checked]="store.unreadOnly()"
            (change)="store.setUnreadOnly(!store.unreadOnly())"
          />
          Solo sin leer
        </label>
      </div>

      <div inbox>
        <app-notification-list
          [items]="store.items()"
          [state]="store.state()"
          (markRead)="store.markRead($event)"
        />
      </div>

      <div prefs>
        <app-preferences-form
          [preferences]="store.preferences()"
          [saving]="store.saving()"
          (toggled)="store.togglePreference($event.type, $event.channel)"
          (save)="store.savePreferences()"
        />
        @if (store.message()) {
          <p role="status" class="state">{{ store.message() }}</p>
        }
      </div>
    </app-notifications-layout>
  `,
})
export class NotificationsPageComponent implements OnInit {
  protected readonly store = inject(NotificationsStore);

  ngOnInit(): void {
    void this.store.load();
    void this.store.loadPreferences();
  }
}
