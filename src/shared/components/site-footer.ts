import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  template: `
    <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">

          <!-- Brand Info -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <span class="text-lg font-bold text-white tracking-tight">HouseING Property</span>
            </div>
            <p class="text-sm text-slate-400 max-w-sm leading-relaxed">Platform discovery, evaluasi spesifikasi mendalam, dan simulasi finansial keputusan kepemilikan properti di Indonesia secara transparan, akurat, dan terverifikasi.</p>
            <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3.5 py-2 rounded-full border border-slate-700/60 w-fit">
              <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span>Listing Resmi Developer Terverifikasi &amp; Bebas Sengketa</span>
            </div>
          </div>

          <!-- Discovery -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Discovery</h4>
            <ul class="space-y-2.5 text-sm">
              <li><button (click)="navigate('/buy')" class="hover:text-white transition-colors">Semua Properti Dijual</button></li>
              <li><button (click)="navigate('/buy?propertyType=type-rumah')" class="hover:text-white transition-colors">Rumah Tapak (Landed House)</button></li>
              <li><button (click)="navigate('/buy?propertyType=type-apartemen')" class="hover:text-white transition-colors">Apartemen &amp; Kondominium</button></li>
              <li><button (click)="navigate('/buy?propertyType=type-villa')" class="hover:text-white transition-colors">Villa &amp; Resort Residences</button></li>
              <li><button (click)="navigate('/buy?city=Padang')" class="hover:text-white transition-colors">Properti di Kota Padang</button></li>
            </ul>
          </div>

          <!-- Decision Tools -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Decision Tools</h4>
            <ul class="space-y-2.5 text-sm">
              <li><button (click)="navigate('/simulator/kpr')" class="hover:text-white transition-colors">Simulator Angsuran KPR</button></li>
              <li><button (click)="navigate('/compare')" class="hover:text-white transition-colors">Komparasi Properti</button></li>
              <li><button (click)="navigate('/favorites')" class="hover:text-white transition-colors">Properti Tersimpan</button></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Layanan Informasi</h4>
            <ul class="space-y-3 text-sm text-slate-400">
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Padang, Jakarta, Bandung &amp; Denpasar</span>
              </li>
              <li class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>+62 811-9876-5432</span>
              </li>
              <li class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>inquiry@houseingproperty.id</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {{ currentYear }} HouseING Property Platform. Seluruh Hak Cipta Dilindungi.</p>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Standardized Domain Architecture
            </span>
            <span>&bull;</span>
            <span>Angular 22 Production Grade</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooterComponent {
  private router = inject(Router);
  readonly currentYear = new Date().getFullYear();

  navigate(path: string): void {
    const [pathname, search] = path.split('?');
    if (search) {
      const params: Record<string, string> = {};
      new URLSearchParams(search).forEach((v, k) => params[k] = v);
      this.router.navigate([pathname], { queryParams: params });
    } else {
      this.router.navigate([pathname]);
    }
  }
}
