import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from '../shared/components/site-header';
import { SiteFooterComponent } from '../shared/components/site-footer';
import { NotificationService } from '../core/services/notification.service';
import { FavoriteService } from '../core/services/favorite.service';
import { ComparisonService } from '../core/services/comparison.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <app-site-header
        [favoritesCount]="favoritesCount()"
        [comparisonCount]="comparisonCount()"
      />
      <div class="flex-1">
        <router-outlet />
      </div>
      <app-site-footer />

      @if (toast()) {
        <aside
          aria-live="polite"
          class="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 text-white rounded-full shadow-2xl border border-slate-700 text-xs font-semibold backdrop-blur-md animate-fade-in"
        >
          @if (toast()!.type === 'success') {
            <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          } @else if (toast()!.type === 'info') {
            <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          } @else {
            <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          }
          <span>{{ toast()!.message }}</span>
          <button
            (click)="notifSvc.dismiss()"
            class="ml-2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
            aria-label="Tutup notifikasi"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </aside>
      }
    </div>
  `,
})
export class AppComponent {
  readonly notifSvc = inject(NotificationService);
  private readonly favSvc = inject(FavoriteService);
  private readonly compSvc = inject(ComparisonService);

  readonly toast = this.notifSvc.toast;
  readonly favoritesCount = computed(() => this.favSvc.favorites().length);
  readonly comparisonCount = computed(() => this.compSvc.comparisonList().length);
}
