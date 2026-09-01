import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto my-6">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 shadow-xs">
        @if (customIcon) {
          <span [innerHTML]="customIcon"></span>
        } @else {
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        }
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-1.5">{{ title }}</h3>
      <p class="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">{{ description }}</p>
      @if (actionText && actionClicked.observers.length > 0) {
        <button
          type="button"
          (click)="actionClicked.emit()"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-all active:scale-[0.98]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          {{ actionText }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() actionText = '';
  @Input() customIcon = '';
  @Output() actionClicked = new EventEmitter<void>();
}
