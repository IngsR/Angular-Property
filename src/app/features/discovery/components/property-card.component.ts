import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Property } from '../../../core/types/property.types';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';

@Component({
  selector: 'app-property-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RupiahPipe],
  template: `
    <article
      (click)="goToDetail()"
      (keydown.enter)="goToDetail()"
      (keydown.space)="goToDetail()"
      tabindex="0"
      role="button"
      [attr.aria-label]="'Lihat rincian ' + property.title"
      [id]="'property-card-' + property.id"
      class="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <!-- Media Figure -->
      <figure class="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 m-0 shrink-0">
        <img
          [src]="primaryImageUrl"
          [alt]="primaryImageAlt"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerpolicy="no-referrer"
          (error)="onImgError($event)"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20 pointer-events-none"
        ></div>

        <!-- Top Badges -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span
              class="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-xs shadow-xs"
              >{{ property.propertyTypeName }}</span
            >
            @if (property.partner?.verified) {
              <span
                class="text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/90 text-white backdrop-blur-xs shadow-xs"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Terverifikasi</span>
              </span>
            }
          </div>
          <button
            type="button"
            (click)="$event.stopPropagation(); toggleFavorite.emit(property.id)"
            [class]="
              'p-2 rounded-full backdrop-blur-md transition-all shadow-xs shrink-0 ' +
              (isFavorite
                ? 'bg-rose-500 text-white shadow-md scale-105'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600')
            "
            [attr.aria-label]="isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'"
          >
            <svg
              [class]="'w-4 h-4 ' + (isFavorite ? 'fill-current' : '')"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <!-- Bottom Location & Availability -->
        <div
          class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium z-10"
        >
          <span class="flex items-center gap-1 drop-shadow-sm truncate max-w-[65%]">
            <svg
              class="w-3.5 h-3.5 text-blue-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="truncate"
              >{{ property.location.district ? property.location.district + ', ' : ''
              }}{{ property.location.city }}</span
            >
          </span>
          <span
            [class]="
              'text-[11px] px-3 py-0.5 rounded-full font-bold backdrop-blur-xs shrink-0 ' +
              availabilityClass
            "
            >{{ availabilityLabel }}</span
          >
        </div>
      </figure>

      <!-- Card Body -->
      <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white space-y-3.5">
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            @if (property.project) {
              <p
                class="text-[11px] font-bold text-blue-600 uppercase tracking-wider truncate flex items-center gap-1"
              >
                <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span class="truncate">{{ property.project.name }}</span>
              </p>
            } @else {
              <span class="text-[11px] font-semibold text-slate-600"
                >Sertifikat {{ property.specification.certificate?.split(' ')?.[0] || 'SHM' }}</span
              >
            }
            @if (hasFloorPlan) {
              <span
                class="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full shrink-0 border border-indigo-100"
              >
                <svg
                  class="w-3 h-3 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Denah {{ property.specification.floors }} Lt</span>
              </span>
            }
          </div>

          <div>
            <h3
              class="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug"
              [title]="property.title"
            >
              {{ property.title }}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {{ property.location.address }}
            </p>
          </div>

          <!-- Specs Grid -->
          <dl
            class="grid grid-cols-4 gap-1 py-2 px-1 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700"
          >
            <div class="flex flex-col items-center justify-center p-1 text-center min-w-0">
              <dt class="sr-only">Kamar Tidur</dt>
              <dd class="flex items-center gap-1 text-xs font-bold text-slate-800">
                <svg
                  class="w-3.5 h-3.5 text-slate-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {{ property.specification.bedrooms }} KT
              </dd>
            </div>
            <div
              class="flex flex-col items-center justify-center p-1 text-center min-w-0 border-l border-slate-200/60"
            >
              <dt class="sr-only">Kamar Mandi</dt>
              <dd class="flex items-center gap-1 text-xs font-bold text-slate-800">
                <svg
                  class="w-3.5 h-3.5 text-slate-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                {{ property.specification.bathrooms }} KM
              </dd>
            </div>
            <div
              class="flex flex-col items-center justify-center p-1 text-center min-w-0 border-l border-slate-200/60"
            >
              <dt class="sr-only">Luas Bangunan</dt>
              <dd class="flex items-center gap-1 text-xs font-bold text-slate-800">
                <svg
                  class="w-3.5 h-3.5 text-slate-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {{ property.specification.buildingArea }} m²
              </dd>
            </div>
            <div
              class="flex flex-col items-center justify-center p-1 text-center min-w-0 border-l border-slate-200/60"
            >
              <dt class="sr-only">Luas Tanah</dt>
              <dd class="flex items-center gap-1 text-xs font-bold text-slate-800">
                <svg
                  class="w-3.5 h-3.5 text-slate-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                {{ property.specification.landArea }} m²
              </dd>
            </div>
          </dl>
        </div>

        <!-- Price & KPR -->
        <div class="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 space-y-2">
          <div>
            <div class="flex items-center justify-between gap-1 mb-0.5">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider"
                >Harga Jual (Tunai / KPR)</span
              >
              <span
                class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60"
                >All-in</span
              >
            </div>
            <div class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              {{ property.price | rupiah }}
            </div>
          </div>
          <div class="pt-2 border-t border-slate-200/80">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <svg
                  class="w-3.5 h-3.5 text-blue-600 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>Cicilan KPR:</span>
              </div>
              <span class="text-xs font-extrabold text-blue-700"
                >~{{ estimatedMonthlyKpr | rupiah: true
                }}<span class="text-[10px] font-semibold text-slate-500">/bln</span></span
              >
            </div>
            <div
              class="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-1"
            >
              <span>DP 20% ({{ dpAmount | rupiah: true }})</span>
              <span>Tenor 20 Thn · 5.5% p.a.</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <footer class="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            (click)="$event.stopPropagation(); toggleCompare.emit(property.id)"
            [class]="
              'flex-1 py-2 px-2.5 rounded-full border text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 ' +
              (isCompared
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900')
            "
            [title]="isCompared ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'"
            aria-label="Bandingkan properti"
          >
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            <span class="whitespace-nowrap text-[11px]">{{
              isCompared ? 'Di Komparasi' : 'Bandingkan'
            }}</span>
          </button>
          <button
            type="button"
            (click)="$event.stopPropagation(); goToDetail()"
            class="flex-1 py-2 px-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
          >
            <span>Lihat Detail</span>
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </footer>
      </div>
    </article>
  `,
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;
  @Input() isFavorite = false;
  @Input() isCompared = false;
  @Output() toggleFavorite = new EventEmitter<string>();
  @Output() toggleCompare = new EventEmitter<string>();

  private router = inject(Router);

  get primaryImageUrl(): string {
    return (
      this.property.images?.[0]?.url ||
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    );
  }

  get primaryImageAlt(): string {
    return this.property.images?.[0]?.alt || this.property.title;
  }

  get hasFloorPlan(): boolean {
    return !!(this.property.floorPlans && this.property.floorPlans.length > 0);
  }

  get estimatedMonthlyKpr(): number {
    const loanPrincipal = this.property.price * 0.8;
    const monthlyRate = 0.055 / 12;
    return Math.round((loanPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -240)));
  }

  get dpAmount(): number {
    return this.property.price * 0.2;
  }

  get availabilityLabel(): string {
    if (this.property.availability === 'AVAILABLE') return 'Tersedia';
    if (this.property.availability === 'LIMITED') return 'Unit Terbatas';
    return 'Terjual';
  }

  get availabilityClass(): string {
    if (this.property.availability === 'AVAILABLE') return 'bg-emerald-600/90 text-white';
    if (this.property.availability === 'LIMITED') return 'bg-amber-500/90 text-white';
    return 'bg-slate-600/90 text-white';
  }

  goToDetail(): void {
    this.router.navigate(['/property', this.property.slug]);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
  }
}
