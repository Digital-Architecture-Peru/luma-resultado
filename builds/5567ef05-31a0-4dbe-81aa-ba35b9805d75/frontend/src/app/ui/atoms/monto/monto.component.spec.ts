import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MontoComponent } from './monto.component';

describe('MontoComponent', () => {
  let fixture: ComponentFixture<MontoComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MontoComponent);
  });

  it('given un valor y una moneda, when renderiza, then formatea con separadores y dos decimales', () => {
    fixture.componentRef.setInput('valor', 1234.5);
    fixture.componentRef.setInput('moneda', 'USD');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1,234.50');
  });
});
