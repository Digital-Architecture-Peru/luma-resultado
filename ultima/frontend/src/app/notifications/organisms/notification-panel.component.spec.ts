import { TestBed } from '@angular/core/testing';
import { StatusFilter } from '../data/models';
import { NotificationPanelComponent } from './notification-panel.component';

function create() {
  const fixture = TestBed.createComponent(NotificationPanelComponent);
  return { fixture, el: fixture.nativeElement as HTMLElement };
}

describe('NotificationPanelComponent', () => {
  it('shows the empty state when there are no notifications', () => {
    const { fixture, el } = create();
    fixture.detectChanges();
    expect(el.textContent).toContain('No tienes notificaciones.');
  });

  it('shows the loading state', () => {
    const { fixture, el } = create();
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(el.textContent).toContain('Cargando');
  });

  it('shows an alert with retry action on error', () => {
    const { fixture, el } = create();
    fixture.componentRef.setInput('error', 'No se pudo cargar.');
    fixture.detectChanges();

    let retried = 0;
    fixture.componentInstance.retry.subscribe(() => retried++);
    const buttons = Array.from(el.querySelectorAll('button'));
    buttons.find((b) => b.textContent?.includes('Reintentar'))!.click();

    expect(el.querySelector('[role="alert"]')?.textContent).toContain('No se pudo cargar.');
    expect(retried).toBe(1);
  });

  it('emits the selected filter', () => {
    const { fixture, el } = create();
    fixture.detectChanges();
    const emitted: StatusFilter[] = [];
    fixture.componentInstance.filterChange.subscribe((f) => emitted.push(f));

    Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes('No leídas'))!.click();

    expect(emitted).toEqual(['UNREAD']);
  });
});
