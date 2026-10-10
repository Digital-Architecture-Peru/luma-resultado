import { TestBed } from '@angular/core/testing';
import { AppNotification } from '../data/models';
import { NotificationItemComponent } from './notification-item.component';

const base: AppNotification = {
  id: 'n-1',
  type: 'PAYMENT_COMPLETED',
  status: 'UNREAD',
  title: 'Pago realizado',
  message: 'Tu pago fue procesado.',
  amount: 1250,
  currency: 'USD',
  maskedAccount: '****1234',
  createdAt: '2026-01-15T10:00:00Z',
  readAt: null,
};

function render(notification: AppNotification) {
  const fixture = TestBed.createComponent(NotificationItemComponent);
  fixture.componentRef.setInput('notification', notification);
  fixture.detectChanges();
  return fixture;
}

describe('NotificationItemComponent', () => {
  it('renders masked account and formatted amount', () => {
    const text = (render(base).nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('****1234');
    expect(text).toContain('1,250.00 USD');
  });

  it('emits the id when "Marcar como leída" is clicked', () => {
    const fixture = render(base);
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!.click();

    expect(emitted).toEqual(['n-1']);
  });

  it('hides the action for already read notifications', () => {
    const fixture = render({ ...base, status: 'READ', readAt: '2026-01-15T11:00:00Z' });
    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
  });
});
