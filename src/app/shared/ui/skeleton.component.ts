import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `<div [class]="'animate-pulse rounded-2xl bg-slate-200 ' + extraClass"></div>`,
})
export class SkeletonComponent {
  @Input() extraClass = 'h-4 w-full';
}
