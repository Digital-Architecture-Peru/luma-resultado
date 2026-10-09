import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardNotification } from '../../domain/card-notification.model';
import { NotificationItemComponent } from './notification-item.component';

const BASE: CardNotification = {
  id: 'x1',
  cardAlias: 'Visa Compras',
  cardLast4: '1111',
  type: 'SECURITY',
  severity: 'critical',
  title: 'Intento rechazado',
  message: 'Mensaje',
  createdAt: '2026-10-04T22:45:00Z',
  read: false,
};

describe('NotificationItemComponent', () => {
  let fixture: ComponentFixture<NotificationItemComponent>;

  function render(notification: CardNotification): HTMLElement {
    fixture = TestBed.createComponent(NotificationItemComponent);
    fixture.componentRef.setInput('notification', notification);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NotificationItemComponent] });
  });

  it('given an unread notification when rendered then shows title, severity and action', () => {
    const el = render(BASE);
    expect(el.textContent).toContain('Intento rechazado');
    expect(el.textContent).toContain('Crítica');
    expect(el.textContent).toContain('····1111');
    expect(el.querySelector('button')).not.toBeNull();
  });

  it('given an unread notification when the button is clicked then emits its id', () => {
    const el = render(BASE);
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));
    (el.querySelector('button') as HTMLButtonElement).click();
    expect(emitted).toEqual(['x1']);
  });

  it('given a read notification when rendered then shows state without button', () => {
    const el = render({ ...BASE, read: true });
    expect(el.querySelector('button')).toBeNull();
    expect(el.textContent).toContain('Leída');
  });
});
