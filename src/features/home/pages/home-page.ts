import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property, PropertyType } from '../../../core/types/property.types';
import { propertyRepository } from '../../../core/repositories/property.repository';
import { PropertyCardComponent } from '../../discovery/components/property-card';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ComparisonService } from '../../../core/services/comparison.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent],
  template: `
    <main class="space-y-16 pb-16">
      <!-- 1. Hero Section -->
      <section class="relative bg-slate-900 text-white overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div class="absolute -top-10 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -top-10 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/25 shadow-xs">
            <svg class="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            <span>Platform Keputusan Properti #1 di Indonesia</span>
          </div>
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
            Temukan Rumah Impian. <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">Evaluasi Spesifikasi. Putuskan Finansial.</span>
          </h1>
          <p class="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Platform komparasi objektif, denah arsitektur riil, dan simulasi KPR akurat dari pengembang terverifikasi di Padang, Jakarta, Bandung, dan Bali.
          </p>

          <!-- Hero Search Box -->
          <div class="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-900 max-w-4xl mx-auto mt-8 border border-slate-100">
            <form (ngSubmit)="handleHeroSearch()" class="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div class="sm:col-span-1 text-left">
                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Kata Kunci</label>
                <input type="text" [(ngModel)]="searchKeyword" name="keyword" placeholder="Kuranji, BSD, Dago..." class="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600" />
              </div>
              <div class="text-left">
                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pilih Kota</label>
                <select [(ngModel)]="searchCity" name="city" class="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
                  <option value="ALL">Semua Kota</option>
                  @for (city of cities(); track city) {
                    <option [value]="city">{{ city }}</option>
                  }
                </select>
              </div>
              <div class="text-left">
                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tipe Properti</label>
                <select [(ngModel)]="searchType" name="type" class="w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer">
                  <option value="ALL">Semua Tipe</option>
                  @for (pt of propertyTypes(); track pt.id) {
                    <option [value]="pt.id">{{ pt.name }}</option>
                  }
                </select>
              </div>
              <div class="flex items-end">
                <button type="submit" class="w-full inline-flex items-center justify-center gap-2 font-bold shadow-md text-sm px-4 py-2 gap-2 min-h-[40px] rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-[0.98]">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  Cari Properti
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- 2. Smart Buying Guide -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <svg class="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            <span>Panduan Pembeli Cerdas</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Tips &amp; Panduan Lengkap Pembelian Rumah</h2>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">Langkah krusial dan panduan praktis agar investasi hunian pertama Anda aman secara hukum, sehat secara finansial, dan nyaman dihuni jangka panjang.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (tip of buyingTips; track tip.step) {
            <div [class]="'bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-' + tip.color + '-400 hover:shadow-md transition-all group flex flex-col justify-between'">
              <div class="space-y-3">
                <div [class]="'w-12 h-12 rounded-xl bg-' + tip.color + '-50 text-' + tip.color + '-600 flex items-center justify-center font-black group-hover:bg-' + tip.color + '-600 group-hover:text-white transition-colors'" [innerHTML]="tip.icon"></div>
                <div class="space-y-1.5">
                  <span [class]="'text-[11px] font-bold text-' + tip.color + '-600 uppercase tracking-wider'">{{ tip.step }}</span>
                  <h3 class="text-base font-bold text-slate-900 leading-snug">{{ tip.title }}</h3>
                  <p class="text-xs text-slate-600 leading-relaxed" [innerHTML]="tip.description"></p>
                </div>
              </div>
              <div [class]="'pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-' + tip.color + '-700'">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{{ tip.footer }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- 3. Featured Properties -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Properti Pilihan Unggulan</h2>
            <p class="text-xs text-slate-500 mt-0.5">Unit terverifikasi dengan legalitas lengkap dan siap huni</p>
          </div>
          <button type="button" (click)="navigate('/buy')" class="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-xs transition-all">
            Lihat Semua Katalog
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (prop of featuredProperties(); track prop.id) {
            <app-property-card
              [property]="prop"
              [isFavorite]="isFavorite(prop.id)"
              [isCompared]="isCompared(prop.id)"
              (toggleFavorite)="onToggleFavorite($event)"
              (toggleCompare)="onToggleCompare($event)"
            />
          }
        </div>
      </section>

      <!-- 4. KPR Simulator Banner -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div class="space-y-3 max-w-xl text-center lg:text-left">
            <span class="text-xs font-bold uppercase tracking-widest text-blue-300">Kalkulator Mandiri</span>
            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Ketahui Kemampuan Cicilan KPR Sebelum Membeli</h3>
            <p class="text-sm text-slate-300 leading-relaxed">Gunakan simulasi anuitas interaktif dengan rekomendasi rasio cicilan terhadap penghasilan keluarga Anda secara instan.</p>
          </div>
          <button type="button" (click)="navigate('/simulator/kpr')" class="inline-flex items-center gap-2.5 text-base px-8 py-3 font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            Buka Simulator KPR
          </button>
        </div>
      </section>

      <!-- 5. Partners -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div class="text-center max-w-2xl mx-auto space-y-1">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Kemitraan Terpercaya</span>
          <h2 class="text-xl font-bold text-slate-900">Pengembang &amp; Developer Properti Resmi</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          @for (dev of developers; track dev.name) {
            <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-2 hover:border-slate-300 transition-colors">
              <img [src]="dev.logo" [alt]="dev.name" class="w-12 h-12 rounded-xl object-cover border border-slate-200" referrerpolicy="no-referrer" />
              <p class="text-xs font-bold text-slate-900 leading-tight">{{ dev.name }}</p>
              <p class="text-[11px] text-slate-500 line-clamp-2">{{ dev.desc }}</p>
            </div>
          }
        </div>
      </section>
    </main>
  `,
})
export class HomePageComponent implements OnInit {
  private router = inject(Router);
  private favSvc = inject(FavoriteService);
  private compSvc = inject(ComparisonService);
  private notifSvc = inject(NotificationService);

  featuredProperties = signal<Property[]>([]);
  cities = signal<string[]>([]);
  propertyTypes = signal<PropertyType[]>([]);

  searchKeyword = '';
  searchCity = 'ALL';
  searchType = 'ALL';

  buyingTips = [
    { step: 'Langkah 1 · Legalitas', title: 'Cek Keaslian Sertifikat & Izin Bangunan (PBG)', description: 'Pastikan status tanah berstatus <strong>Sertifikat Hak Milik (SHM)</strong> atau HGB murni, serta memiliki Persetujuan Bangunan Gedung (PBG/IMB) resmi dan bebas dari sengketa perbankan.', footer: 'Verifikasi BPN & Notaris', color: 'blue', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>' },
    { step: 'Langkah 2 · Finansial', title: 'Terapkan Rasio Cicilan Maksimal 30% Gaji', description: 'Idealnya total angsuran KPR tidak melebihi <strong>30% - 35%</strong> dari penghasilan gabungan bulanan. Siapkan juga dana darurat 3-6 bulan dan biaya akad jual beli (BPHTB & Notaris).', footer: 'Gunakan Simulasi KPR All-in', color: 'emerald', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>' },
    { step: 'Langkah 3 · Arsitektur', title: 'Analisis Denah, Pencahayaan & Ventilasi Alami', description: 'Periksa tata letak ruang per lantai, arah bukaan jendela terhadap matahari, sirkulasi silang, serta opsi pengembangan struktur bangunan di masa depan.', footer: 'Cek Blueprint & Ketinggian Plafon', color: 'indigo', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>' },
    { step: 'Langkah 4 · Lapangan', title: 'Survei Fisik Lingkungan & Bandingkan Opsi', description: 'Lakukan survei saat musim hujan untuk memastikan kawasan bebas banjir, uji kualitas air tanah, periksa aksesibilitas jalan utama, dan komparasikan 2-4 unit pilihan secara objektif.', footer: 'Manfaatkan Fitur Komparasi', color: 'purple', icon: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>' },
  ];

  developers = [
    { name: 'PT Ranah Minang Propertindo', desc: 'Spesialis Hunian Anti-Gempa Sumatera Barat', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=160&q=80' },
    { name: 'Sinarmas Land Developer', desc: 'Kota Mandiri BSD City & Urban Living', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=160&q=80' },
    { name: 'Ciputra Group Heritage', desc: 'EcoCulture & Prestisius Lifestyle', logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=160&q=80' },
    { name: 'Bali Sanctuary Living', desc: 'Luxury Resort & High Yield Villas', logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=160&q=80' },
  ];

  async ngOnInit(): Promise<void> {
    const [featured, cityList, types] = await Promise.all([
      propertyRepository.getFeaturedProperties(6),
      propertyRepository.getCities(),
      propertyRepository.getPropertyTypes(),
    ]);
    this.featuredProperties.set(featured);
    this.cities.set(cityList);
    this.propertyTypes.set(types);
  }

  isFavorite(id: string): boolean {
    return this.favSvc.isFavorite(id);
  }

  isCompared(id: string): boolean {
    return this.compSvc.isInComparison(id);
  }

  onToggleFavorite(id: string): void {
    const added = this.favSvc.toggle(id);
    this.notifSvc.show(added ? 'Properti berhasil disimpan ke favorit' : 'Properti dihapus dari daftar favorit', 'success');
  }

  onToggleCompare(id: string): void {
    const result = this.compSvc.toggle(id);
    this.notifSvc.show(result.message, result.isInComparison ? 'success' : 'info');
  }

  handleHeroSearch(): void {
    const params = new URLSearchParams();
    if (this.searchKeyword.trim()) params.set('search', this.searchKeyword.trim());
    if (this.searchCity !== 'ALL') params.set('city', this.searchCity);
    if (this.searchType !== 'ALL') params.set('propertyType', this.searchType);
    const queryString = params.toString();
    this.router.navigateByUrl(`/buy${queryString ? '?' + queryString : ''}`);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
