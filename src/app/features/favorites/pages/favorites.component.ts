import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { ComparisonService } from '../../../core/services/comparison.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../core/types/property.types';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state.component';
import { SkeletonComponent } from '../../../shared/ui/skeleton.component';
import { PropertyCardComponent } from '../../discovery/components/property-card.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PropertyCardComponent,
    BreadcrumbsComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <app-breadcrumbs [items]="[{ label: 'Properti Tersimpan (Favorit)' }]" />

      <!-- Header Bar -->
      <section
        aria-label="Informasi Favorit"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs"
      >
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">
              Properti Tersimpan ({{ favSvc.favorites().length }})
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              Daftar listing hunian yang Anda simpan untuk dievaluasi lebih lanjut.
            </p>
          </div>
        </div>

        @if (favSvc.favorites().length > 0) {
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="navigate('/compare')"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <svg
                class="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              <span>Buka Komparasi</span>
            </button>
            <button
              type="button"
              (click)="clearFavorites()"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
            >
              <svg
                class="w-4 h-4 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Hapus Semua</span>
            </button>
          </div>
        }
      </section>

      <!-- Content -->
      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-skeleton extraClass="h-80 w-full" />
          <app-skeleton extraClass="h-80 w-full" />
          <app-skeleton extraClass="h-80 w-full" />
        </div>
      } @else if (properties().length === 0) {
        <div class="py-12">
          <app-empty-state
            title="Belum Ada Properti yang Disimpan"
            description="Simpan listing yang menarik perhatian Anda dengan menekan ikon hati pada kartu properti untuk memudahkan perbandingan di kemudian waktu."
            actionText="Jelajahi Properti Pilihan"
            (actionClicked)="navigate('/buy')"
          />
        </div>
      } @else {
        <section
          aria-label="Daftar Favorit"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          @for (property of properties(); track property.id) {
            <app-property-card
              [property]="property"
              [isFavorite]="true"
              [isCompared]="compSvc.isInComparison(property.id)"
              (toggleFavorite)="onToggleFavorite($event)"
              (toggleCompare)="onToggleCompare($event)"
            />
          }
        </section>
      }
    </main>
  `,
})
export class FavoritesPageComponent {
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);
  readonly favSvc = inject(FavoriteService);
  readonly compSvc = inject(ComparisonService);
  private readonly notifSvc = inject(NotificationService);

  readonly properties = signal<Property[]>([]);
  readonly loading = signal(true);

  constructor() {
    effect(async () => {
      const favIds = this.favSvc.favorites();
      untracked(() => {
        this.loadFavorites(favIds);
      });
    });
  }

  async loadFavorites(ids: string[]): Promise<void> {
    this.loading.set(true);
    try {
      if (ids.length === 0) {
        this.properties.set([]);
      } else {
        const data = await this.propertyService.getPropertiesByIds(ids);
        this.properties.set(data);
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      this.loading.set(false);
    }
  }

  onToggleFavorite(id: string): void {
    this.favSvc.toggle(id);
    this.notifSvc.show('Properti dihapus dari daftar favorit', 'info');
  }

  onToggleCompare(id: string): void {
    const result = this.compSvc.toggle(id);
    this.notifSvc.show(result.message, result.isInComparison ? 'success' : 'info');
  }

  clearFavorites(): void {
    this.favSvc.clear();
    this.notifSvc.show('Semua favorit telah dihapus', 'info');
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
