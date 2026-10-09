import { Component, input } from '@angular/core';
import { BadgeTone } from '../data/models';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [attr.data-tone]="tone()"><ng-content /></span>`,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');
}
