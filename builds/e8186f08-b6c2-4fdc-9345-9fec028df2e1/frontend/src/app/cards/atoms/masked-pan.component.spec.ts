import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaskedPanComponent } from './masked-pan.component';

describe('MaskedPanComponent', () => {
  let fixture: ComponentFixture<MaskedPanComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskedPanComponent);
    fixture.componentRef.setInput('value', '**** **** **** 4242');
    fixture.detectChanges();
  });

  it('renders the masked value', () => {
    expect(fixture.nativeElement.textContent).toContain('**** **** **** 4242');
  });

  it('exposes an accessible label with the last four digits', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.pan');
    expect(el.getAttribute('aria-label')).toBe('Tarjeta terminada en 4242');
  });
});
