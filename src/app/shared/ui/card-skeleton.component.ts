import { Component } from '@angular/core';

@Component({
  selector: 'app-property-card-skeleton',
  standalone: true,
  template: `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div class="h-48 sm:h-52 bg-slate-200"></div>
      <div class="p-4 sm:p-5 space-y-3">
        <div class="h-3 bg-slate-200 rounded-full w-1/3"></div>
        <div class="h-4 bg-slate-200 rounded-full w-3/4"></div>
        <div class="h-3 bg-slate-200 rounded-full w-1/2"></div>
        <div class="h-16 bg-slate-100 rounded-2xl"></div>
        <div class="h-10 bg-slate-100 rounded-2xl"></div>
        <div class="grid grid-cols-2 gap-2">
          <div class="h-9 bg-slate-100 rounded-full"></div>
          <div class="h-9 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  `,
})
export class PropertyCardSkeletonComponent {}
