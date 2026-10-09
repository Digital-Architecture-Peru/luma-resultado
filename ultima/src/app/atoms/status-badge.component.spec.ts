import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('given estado REJECTED when renderiza then muestra texto y clase', async () => {
    const fixture = TestBed.createComponent(StatusBadgeComponent);
    fixture.componentRef.setInput('status', 'REJECTED');
    await fixture.whenStable();
    const span = (fixture.nativeElement as HTMLElement).querySelector('span');
    expect(span?.textContent).toContain('Rechazado');
    expect(span?.classList.contains('badge-rejected')).toBe(true);
  });
});
