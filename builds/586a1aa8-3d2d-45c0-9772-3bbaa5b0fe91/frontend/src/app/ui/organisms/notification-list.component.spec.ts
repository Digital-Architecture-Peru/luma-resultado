import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentNotification } from '../../core/models';
import { NotificationListComponent } from './notification-list.component';

function notification(id: string, status: 'UNREAD' | 'READ'): PaymentNotification {
  return {
    id,
    paymentId: 'PAY-' + id,
    eventType: 'PAGO_EXITOSO',
    amount: 25,
    currency: 'USD',
    maskedAccount: '****1234',
    status,
    createdAt: '2026-01-15T10:00:00Z',
    readAt: null,
  };
}

describe('NotificationListComponent', () => {
  let fixture: ComponentFixture<NotificationListComponent>;
  let component: NotificationListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NotificationListComponent] });
    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
  });

  it('renders one item per notification', () => {
    fixture.componentRef.setInput('items', [notification('a', 'UNREAD'), notification('b', 'READ')]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-notification-item').length).toBe(2);
  });

  it('shows an empty message when there are no notifications', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No tienes notificaciones');
  });

  it('shows an alert when there is an error', () => {
    fixture.componentRef.setInput('error', 'Fallo de red');
    fixture.detectChanges();

    const alert: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert.textContent).toContain('Fallo de red');
  });

  it('emits the id when the mark-as-read button is clicked', () => {
    spyOn(component.markRead, 'emit');
    fixture.componentRef.setInput('items', [notification('a', 'UNREAD')]);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.markRead.emit).toHaveBeenCalledWith('a');
  });

  it('hides the button for notifications already read', () => {
    fixture.componentRef.setInput('items', [notification('b', 'READ')]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});
