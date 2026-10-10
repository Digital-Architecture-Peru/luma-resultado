import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationItemComponent } from './notification-item.component';
import { AccountNotification } from '../models/notification.model';

const BASE: AccountNotification = {
  id: 'n-1',
  account: '****1234',
  type: 'DEPOSIT',
  message: 'Depósito recibido',
  amount: 1500,
  read: false,
  createdAt: '2026-01-15T10:00:00Z',
};

describe('NotificationItemComponent', () => {
  let fixture: ComponentFixture<NotificationItemComponent>;

  function render(notification: AccountNotification): HTMLElement {
    fixture = TestBed.createComponent(NotificationItemComponent);
    fixture.componentInstance.notification = notification;
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NotificationItemComponent] });
  });

  it('given an unread notification, when clicking the button, then emits its id', () => {
    const el = render(BASE);
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));

    el.querySelector('button')!.click();

    expect(emitted).toEqual(['n-1']);
  });

  it('given a read notification, when rendered, then shows no action button', () => {
    const el = render({ ...BASE, read: true });

    expect(el.querySelector('button')).toBeNull();
  });

  it('given a masked account, when rendered, then shows only the masked value', () => {
    const el = render(BASE);

    expect(el.textContent).toContain('****1234');
    expect(el.textContent).toContain('Depósito');
  });
});
