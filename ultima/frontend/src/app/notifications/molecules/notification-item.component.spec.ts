import { TestBed } from '@angular/core/testing';
import { NotificationItemComponent } from './notification-item.component';
import { AccountNotification } from '../data/models';

const base: AccountNotification = {
  id: 'n1',
  accountId: 'ACC-001',
  type: 'DEPOSIT',
  title: 'Depósito recibido',
  message: 'Cuenta ****1234',
  createdAt: '2026-10-09T12:00:00Z',
  read: false
};

function render(notification: AccountNotification) {
  const fixture = TestBed.createComponent(NotificationItemComponent);
  fixture.componentInstance.notification = notification;
  fixture.detectChanges();
  return fixture;
}

describe('NotificationItemComponent', () => {
  it('given unread notification when clicking button then emits its id', () => {
    const fixture = render(base);
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id: string) => emitted.push(id));

    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();

    expect(emitted).toEqual(['n1']);
  });

  it('given read notification when rendered then hides the button', () => {
    const fixture = render({ ...base, read: true });

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
  });

  it('given a notification when rendered then shows title and message', () => {
    const text = (render(base).nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Depósito recibido');
    expect(text).toContain('Cuenta ****1234');
  });
});
