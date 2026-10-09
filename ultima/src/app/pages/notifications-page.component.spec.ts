import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { NotificationsPageComponent } from './notifications-page.component';
import { AccountNotification } from '../domain/notification.model';
import { NotificationRepository } from '../domain/notification.repository';
import { makeNotification } from '../testing/factories';

class FakeRepository extends NotificationRepository {
  override list(): Observable<AccountNotification[]> {
    return of([
      makeNotification({ id: 'a', title: 'Primera', read: false }),
      makeNotification({ id: 'b', title: 'Segunda', read: true }),
    ]);
  }
}

function render() {
  TestBed.configureTestingModule({
    imports: [NotificationsPageComponent],
    providers: [{ provide: NotificationRepository, useClass: FakeRepository }],
  });
  const fixture = TestBed.createComponent(NotificationsPageComponent);
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  const click = (text: string) => {
    Array.from(root.querySelectorAll('button'))
      .find((b) => b.textContent?.trim() === text)
      ?.click();
    fixture.detectChanges();
  };
  return { root, click };
}

describe('NotificationsPageComponent', () => {
  it('given loaded data, when rendered, then lists all and announces unread count', () => {
    const { root } = render();
    expect(root.querySelectorAll('app-notification-item')).toHaveLength(2);
    expect(root.querySelector('[role="status"]')?.textContent).toContain('1 notificaciones sin leer');
  });

  it('given the unread filter, when clicked, then only unread are shown', () => {
    const { root, click } = render();
    click('No leídas');
    expect(root.querySelectorAll('app-notification-item')).toHaveLength(1);
    expect(root.textContent).toContain('Primera');
  });

  it('given unread items, when mark all is clicked, then status reports none unread', () => {
    const { root, click } = render();
    click('Marcar todas como leídas');
    expect(root.querySelector('[role="status"]')?.textContent).toContain('No tienes notificaciones sin leer');
  });

  it('given an item, when dismissed, then it disappears from the list', () => {
    const { root, click } = render();
    click('Descartar');
    expect(root.querySelectorAll('app-notification-item')).toHaveLength(1);
  });
});
