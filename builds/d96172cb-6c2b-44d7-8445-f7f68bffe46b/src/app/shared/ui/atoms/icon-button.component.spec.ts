import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  let fixture: ComponentFixture<IconButtonComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IconButtonComponent);
    fixture.componentRef.setInput('label', 'Volver');
    fixture.detectChanges();
  });

  it('given a label when rendered then the button has an accessible name', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-label')).toBe('Volver');
  });

  it('given a click when pressed then emits once', () => {
    let count = 0;
    fixture.componentInstance.pressed.subscribe(() => count++);
    fixture.nativeElement.querySelector('button').click();
    expect(count).toBe(1);
  });
});
