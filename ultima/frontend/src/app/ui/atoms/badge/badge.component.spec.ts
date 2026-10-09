import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeComponent);
  });

  it('given texto y tono, when renderiza, then muestra el texto con la clase del tono', () => {
    fixture.componentRef.setInput('texto', 'ACTIVA');
    fixture.componentRef.setInput('tono', 'ok');
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.textContent).toContain('ACTIVA');
    expect(span.classList.contains('badge--ok')).toBe(true);
  });
});
