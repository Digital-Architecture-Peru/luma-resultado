import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppButton } from './app-button';

describe('AppButton', () => {
  let fixture: ComponentFixture<AppButton>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppButton],
      providers: [provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(AppButton);
    fixture.componentRef.setInput('label', 'Confirmar');
    await fixture.whenStable();
  });

  it('given a label then renders it as the accessible name', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Confirmar');
  });

  it('given a click then emits pressed once', () => {
    let count = 0;
    fixture.componentInstance.pressed.subscribe(() => (count += 1));
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(count).toBe(1);
  });

  it('given disabled then the native button is disabled', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect((fixture.nativeElement.querySelector('button') as HTMLButtonElement).disabled).toBe(true);
  });
});
