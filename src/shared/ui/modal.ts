import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen) {
      <div
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        (click)="onBackdropClick($event)"
      >
        <div
          [class]="'relative w-full ' + maxWidthClass + ' bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]'"
          (click)="$event.stopPropagation()"
        >
          @if (title) {
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 class="text-base font-bold text-slate-900">{{ title }}</h3>
              <button (click)="close.emit()" class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors" aria-label="Tutup dialog">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          }
          @if (!title) {
            <button (click)="close.emit()" class="absolute top-4 right-4 z-10 p-1.5 bg-white/80 backdrop-blur-xs text-slate-600 hover:text-slate-900 rounded-full shadow-xs hover:bg-white transition-colors" aria-label="Tutup dialog">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          }
          <div class="overflow-y-auto p-6 flex-1">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full' = 'lg';
  @Output() close = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  get maxWidthClass(): string {
    const map: Record<string, string> = {
      sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg',
      xl: 'max-w-xl', '2xl': 'max-w-2xl', '4xl': 'max-w-4xl', full: 'max-w-6xl'
    };
    return map[this.maxWidth] || 'max-w-lg';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close.emit();
      this.closed.emit();
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
      this.closed.emit();
    }
  }
}
