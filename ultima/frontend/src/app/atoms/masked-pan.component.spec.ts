import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaskedPanComponent } from './masked-pan.component';

describe('MaskedPanComponent', () => {
  let fixture: ComponentFixture<MaskedPanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MaskedPanComponent] }).compileComponents();
    fixture = TestBed.createComponent(MaskedPanComponent);
    fixture.componentRef.setInput('pan', '**** 1234');
    fixture.detectChanges();
  });

  it('given a masked pan, when rendered, then it shows it and labels the last digits', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.pan');

    expect(el.textContent).toBe('**** 1234');
    expect(el.getAttribute('aria-label')).toBe('Tarjeta terminada en 1234');
  });
});
