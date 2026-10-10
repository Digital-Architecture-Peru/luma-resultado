import { TestBed } from '@angular/core/testing';
import { NotificationListComponent } from './notification-list.component';
import { AccountNotification } from '../models/notification.model';

function item(id: string): AccountNotification {
  return {
    id,
    account: '****1234',
    type: 'WITHDRAWAL',
    message: `Mensaje ${id}`,
    amount: 20,
    read: false,
    createdAt: '2026-01-15T10:00:00Z',
  };
}

describe('NotificationListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NotificationListComponent] });
  });

  it('given no items, when rendered, then shows the empty state', () => {
    const fixture = TestBed.createComponent(NotificationListComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No tienes notificaciones');
  });

  it('given two items, when rendered, then lists both', () => {
    const fixture = TestBed.createComponent(NotificationListComponent);
    fixture.componentInstance.items = [item('a'), item('b')];
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('li').length).toBe(2);
  });

  it('given an item, when its button is clicked, then bubbles the id up', () => {
    const fixture = TestBed.createComponent(NotificationListComponent);
    fixture.componentInstance.items = [item('a')];
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(emitted).toEqual(['a']);
  });
});
