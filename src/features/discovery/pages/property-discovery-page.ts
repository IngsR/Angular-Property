import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property, PropertyQuery, PropertySortOption, PropertyType, Facility } from '../../../core/types/property.types';
import { propertyRepository } from '../../../core/repositories/property.repository';
import { PropertyCardComponent } from '../components/property-card';
import { PropertyCardSkeletonComponent } from '../../../shared/ui/skeleton';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs';
import { ModalComponent } from '../../../shared/ui/modal';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ComparisonService } from '../../../core/services/comparison.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';

@Component({
  selector: 'app-property-discovery-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent, PropertyCardSkeletonComponent, BreadcrumbsComponent],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <app-breadcrumbs [items]="breadcrumbs()" />

      <!-- Search Console -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 mb-6 space-y-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" [(ngModel)]="searchText" (ngModelChange)="onSearchChange()" placeholder="Cari properti, kota, developer..." class="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50" />
          </div>
          <select [(ngModel)]="selectedCity" (ngModelChange)="onFilterChange()" class="text-sm font-semibold px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
            <option value="">Semua Kota</option>
            @for (city of cities(); track city) { <option [value]="city">{{ city }}</option> }
          </select>
          <select [(ngModel)]="selectedType" (ngModelChange)="onFilterChange()" class="text-sm font-semibold px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
            <option value="">Semua Tipe</option>
            @for (pt of propertyTypes(); track pt.id) { <option [value]="pt.id">{{ pt.name }}</option> }
          </select>
          @if (activeFilterCount() > 0) {
            <button type="button" (click)="resetFilters()" class="px-4 py-2.5 rounded-full text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all border border-rose-200">
              Reset ({{ activeFilterCount() }})
            </button>
          }
        </div>
      </div>

      <!-- Sort Header -->
      <div class="flex items-center justify-between mb-5 py-2.5 border-b border-slate-200">
        <p class="text-sm text-slate-600 font-medium"><span class="font-bold text-slate-900">{{ total() }}</span> properti ditemukan</p>
        <div class="flex items-center gap-2">
          <button type="button" (click)="mobileFilterOpen.set(true)" class="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Filter
          </button>
          <select [(ngModel)]="currentSort" (ngModelChange)="onSortChange()" class="text-xs font-semibold px-3.5 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
            <option value="relevance">Relevansi</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="newest">Terbaru</option>
            <option value="land_area_desc">Luas Tanah Terbesar</option>
            <option value="building_area_desc">Luas Bangunan Terbesar</option>
          </select>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <!-- Sidebar Filter (desktop) -->
        <div class="hidden lg:block lg:col-span-1 sticky top-20">
          <div class="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Filter Lanjutan</h3>
            <!-- Price Range -->
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Harga Minimum</label>
              <select [(ngModel)]="minPrice" (ngModelChange)="onFilterChange()" class="w-full text-xs font-semibold px-3 py-2 rounded-full border border-slate-200 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600">
                <option [value]="0">Tanpa Batas</option>
                <option [value]="300000000">Rp 300 Jt</option>
                <option [value]="500000000">Rp 500 Jt</option>
                <option [value]="750000000">Rp 750 Jt</option>
                <option [value]="1000000000">Rp 1 M</option>
                <option [value]="2000000000">Rp 2 M</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Harga Maksimum</label>
              <select [(ngModel)]="maxPrice" (ngModelChange)="onFilterChange()" class="w-full text-xs font-semibold px-3 py-2 rounded-full border border-slate-200 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600">
                <option [value]="0">Tanpa Batas</option>
                <option [value]="500000000">Rp 500 Jt</option>
                <option [value]="1000000000">Rp 1 M</option>
                <option [value]="2000000000">Rp 2 M</option>
                <option [value]="5000000000">Rp 5 M</option>
              </select>
            </div>
            <!-- Bedrooms -->
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Kamar Tidur</label>
              <div class="flex flex-wrap gap-1.5">
                @for (opt of ['Semua', '1', '2', '3', '4+'] ; track opt) {
                  <button type="button" (click)="setBedrooms(opt)" [class]="'px-3 py-1.5 rounded-full text-xs font-semibold transition-all ' + (bedroomsFilter === opt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')">{{ opt }}</button>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Results Column -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Transparency Banner -->
          <div class="p-4 rounded-3xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
            <div class="flex items-start gap-2.5">
              <div class="p-2.5 rounded-full bg-blue-600 text-white shrink-0 shadow-2xs mt-0.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm">Transparansi Harga &amp; Estimasi Cicilan KPR</p>
                <p class="text-slate-600 text-xs mt-0.5 leading-relaxed">Semua harga adalah harga resmi pengembang. Estimasi cicilan dihitung berdasarkan <strong>DP 20%</strong>, bunga efektif <strong>5.5% p.a.</strong>, tenor <strong>20 tahun</strong>.</p>
              </div>
            </div>
          </div>

          <!-- Loading/Empty/Results -->
          @if (loading()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (i of [1,2,3,4,5,6]; track i) { <app-property-card-skeleton /> }
            </div>
          } @else if (properties().length === 0) {
            <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-5">
              <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <div class="max-w-md mx-auto space-y-1.5">
                <h3 class="text-lg font-bold text-slate-900">Tidak Ditemukan Properti yang Cocok</h3>
                <p class="text-sm text-slate-500 leading-relaxed">Kami tidak menemukan properti yang sesuai dengan filter saat ini.</p>
              </div>
              <button type="button" (click)="resetFilters()" class="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 mx-auto active:scale-95">
                Reset Semua Filter
              </button>
            </div>
          } @else {
            <section aria-label="Daftar Properti" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (property of properties(); track property.id) {
                <app-property-card
                  [property]="property"
                  [isFavorite]="isFavorite(property.id)"
                  [isCompared]="isCompared(property.id)"
                  (toggleFavorite)="onToggleFavorite($event)"
                  (toggleCompare)="onToggleCompare($event)"
                />
              }
            </section>
          }
        </div>
      </div>
    </main>
  `,
})
export class PropertyDiscoveryPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private favSvc = inject(FavoriteService);
  private compSvc = inject(ComparisonService);
  private notifSvc = inject(NotificationService);

  properties = signal<Property[]>([]);
  cities = signal<string[]>([]);
  propertyTypes = signal<PropertyType[]>([]);
  total = signal(0);
  loading = signal(true);
  mobileFilterOpen = signal(false);

  searchText = '';
  selectedCity = '';
  selectedType = '';
  minPrice = 0;
  maxPrice = 0;
  bedroomsFilter = 'Semua';
  currentSort: PropertySortOption = 'relevance';

  activeFilterCount = computed(() => [
    this.selectedCity, this.selectedType,
    this.minPrice > 0 ? 'min' : '',
    this.maxPrice > 0 ? 'max' : '',
    this.bedroomsFilter !== 'Semua' ? this.bedroomsFilter : '',
    this.searchText,
  ].filter(Boolean).length);

  breadcrumbs = computed(() => {
    const items: { label: string; path?: string }[] = [{ label: 'Jelajah Properti', path: '/buy' }];
    if (this.selectedCity) items.push({ label: `Kota ${this.selectedCity}` });
    return items;
  });

  async ngOnInit(): Promise<void> {
    // Read query params
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchText = params['search'];
      if (params['city']) this.selectedCity = params['city'];
      if (params['propertyType']) this.selectedType = params['propertyType'];
    });

    const [cities, types] = await Promise.all([
      propertyRepository.getCities(),
      propertyRepository.getPropertyTypes(),
    ]);
    this.cities.set(cities);
    this.propertyTypes.set(types);
    await this.loadProperties();
  }

  async loadProperties(): Promise<void> {
    this.loading.set(true);
    const query: PropertyQuery = { sort: this.currentSort };
    if (this.searchText.trim()) query.search = this.searchText.trim();
    if (this.selectedCity) query.city = this.selectedCity;
    if (this.selectedType) query.propertyType = this.selectedType;
    if (this.minPrice > 0) query.minPrice = this.minPrice;
    if (this.maxPrice > 0) query.maxPrice = this.maxPrice;
    if (this.bedroomsFilter !== 'Semua') query.bedrooms = this.bedroomsFilter === '4+' ? '4+' : Number(this.bedroomsFilter);
    const result = await propertyRepository.getProperties(query);
    this.properties.set(result.properties);
    this.total.set(result.total);
    this.loading.set(false);
  }

  onSearchChange(): void { this.loadProperties(); }
  onFilterChange(): void { this.loadProperties(); }
  onSortChange(): void { this.loadProperties(); }
  setBedrooms(opt: string): void { this.bedroomsFilter = opt; this.loadProperties(); }

  resetFilters(): void {
    this.searchText = ''; this.selectedCity = ''; this.selectedType = '';
    this.minPrice = 0; this.maxPrice = 0; this.bedroomsFilter = 'Semua';
    this.currentSort = 'relevance'; this.mobileFilterOpen.set(false);
    this.loadProperties();
  }

  isFavorite(id: string): boolean { return this.favSvc.isFavorite(id); }
  isCompared(id: string): boolean { return this.compSvc.isInComparison(id); }

  onToggleFavorite(id: string): void {
    const added = this.favSvc.toggle(id);
    this.notifSvc.show(added ? 'Properti berhasil disimpan ke favorit' : 'Properti dihapus dari daftar favorit', 'success');
  }
  onToggleCompare(id: string): void {
    const result = this.compSvc.toggle(id);
    this.notifSvc.show(result.message, result.isInComparison ? 'success' : 'info');
  }
}
