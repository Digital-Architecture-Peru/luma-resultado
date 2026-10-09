import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppButtonComponent } from './app-button.component';

describe('AppButtonComponent', () => {
  let fixture: ComponentFixture<AppButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppButtonComponent] });
    fixture = TestBed.createComponent(AppButtonComponent);
  });

  it('given disabled input, when rendered, then the native button is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('given type submit, when rendered, then the button has type submit', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.type).toBe('submit');
  });
});
