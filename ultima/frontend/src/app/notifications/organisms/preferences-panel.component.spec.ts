import { TestBed } from '@angular/core/testing';
import { PreferencesPanelComponent } from './preferences-panel.component';
import { PreferencesUpdate } from '../models/notification.model';

describe('PreferencesPanelComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PreferencesPanelComponent] });
  });

  it('given loaded preferences, when submitting, then emits those values', () => {
    const fixture = TestBed.createComponent(PreferencesPanelComponent);
    fixture.componentInstance.preferences = {
      account: '****1234',
      lowBalanceThreshold: 250,
      depositEnabled: false,
      withdrawalEnabled: true,
      updatedAt: '2026-01-15T10:00:00Z',
    };
    const emitted: PreferencesUpdate[] = [];
    fixture.componentInstance.save.subscribe((u) => emitted.push(u));
    fixture.detectChanges();

    fixture.componentInstance.submit(new Event('submit'));

    expect(emitted).toEqual([{ lowBalanceThreshold: 250, depositEnabled: false, withdrawalEnabled: true }]);
  });

  it('given a negative threshold, when submitting, then shows an error and emits nothing', () => {
    const fixture = TestBed.createComponent(PreferencesPanelComponent);
    fixture.componentInstance.threshold = -5;
    const emitted: PreferencesUpdate[] = [];
    fixture.componentInstance.save.subscribe((u) => emitted.push(u));

    fixture.componentInstance.submit(new Event('submit'));
    fixture.detectChanges();

    expect(emitted).toHaveLength(0);
    expect((fixture.nativeElement as HTMLElement).querySelector('[role=alert]')).not.toBeNull();
  });
});
