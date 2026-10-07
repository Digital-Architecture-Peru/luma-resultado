import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeComponent);
  });

  it('given a label when rendered then shows the text', () => {
    fixture.componentRef.setInput('label', 'Activa');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Activa');
  });

  it('given a tone when rendered then applies the tone class', () => {
    fixture.componentRef.setInput('label', 'Bloqueada');
    fixture.componentRef.setInput('tone', 'warn');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.badge').classList).toContain('warn');
  });
});
