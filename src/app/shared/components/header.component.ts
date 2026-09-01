import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header
      [class]="
        'w-full z-40 transition-all ' +
        (isHomePage
          ? 'absolute top-0 left-0 right-0 bg-transparent'
          : 'sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm')
      "
    >
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          <!-- Brand Logo -->
          <a
            routerLink="/"
            class="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div
              [class]="
                'w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all shadow-xs shrink-0 ' +
                (isHomePage
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-slate-100 border border-slate-200')
              "
            >
              <img
                src="/logo.ico"
                alt="HouseING Property Logo"
                width="40"
                height="40"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div class="flex items-baseline gap-1.5">
              <span
                [class]="
                  'text-sm sm:text-lg font-black tracking-tight ' +
                  (isHomePage ? 'text-white' : 'text-slate-900')
                "
                >HouseING Property</span
              >
              <span
                [class]="
                  'hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ' +
                  (isHomePage
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    : 'bg-blue-50 text-blue-700 border-blue-200/80')
                "
                >Platform</span
              >
            </div>
            <span class="sr-only">Portofolio Ikhwan Ramadhan, Frontend Engineer</span>
          </a>

          <!-- Desktop Navigation -->
          <nav
            [class]="
              'hidden md:flex items-center gap-1 p-1.5 rounded-full backdrop-blur-xl border shadow-md transition-all ' +
              (isHomePage
                ? 'bg-slate-900/60 border-white/15 text-white'
                : 'bg-white/90 border-slate-200/90 text-slate-700')
            "
            aria-label="Desktop Main Navigation"
          >
            <!-- Beranda -->
            <a
              [routerLink]="'/'"
              routerLinkActive="active-nav"
              [routerLinkActiveOptions]="{ exact: true }"
              #rla0="routerLinkActive"
              [class]="
                'relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ' +
                getDesktopNavClass(rla0.isActive)
              "
            >
              <svg
                class="w-3.5 h-3.5 shrink-0"
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
              <span>Beranda</span>
            </a>
            <!-- Jelajah -->
            <a
              [routerLink]="'/buy'"
              routerLinkActive="active-nav"
              #rla1="routerLinkActive"
              [class]="
                'relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ' +
                getDesktopNavClass(rla1.isActive)
              "
            >
              <svg
                class="w-3.5 h-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span>Jelajah</span>
            </a>
            <!-- Bandingkan -->
            <a
              [routerLink]="'/compare'"
              routerLinkActive="active-nav"
              #rla2="routerLinkActive"
              [class]="
                'relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ' +
                getDesktopNavClass(rla2.isActive)
              "
            >
              <svg
                class="w-3.5 h-3.5 shrink-0"
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
              <span>Bandingkan</span>
              @if (comparisonCount > 0) {
                <span
                  [class]="
                    'inline-flex items-center justify-center px-1.5 py-0 text-[9px] font-black rounded-full ' +
                    (rla2.isActive ? 'bg-white text-blue-700' : 'bg-blue-500 text-white')
                  "
                  >{{ comparisonCount }}</span
                >
              }
            </a>
            <!-- Favorit -->
            <a
              [routerLink]="'/favorites'"
              routerLinkActive="active-nav"
              #rla3="routerLinkActive"
              [class]="
                'relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ' +
                getDesktopNavClass(rla3.isActive)
              "
            >
              <svg
                class="w-3.5 h-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span>Favorit</span>
              @if (favoritesCount > 0) {
                <span
                  [class]="
                    'inline-flex items-center justify-center px-1.5 py-0 text-[9px] font-black rounded-full ' +
                    (rla3.isActive ? 'bg-white text-blue-700' : 'bg-blue-500 text-white')
                  "
                  >{{ favoritesCount }}</span
                >
              }
            </a>
            <!-- Simulator KPR -->
            <a
              [routerLink]="'/simulator/kpr'"
              routerLinkActive="active-nav"
              #rla4="routerLinkActive"
              [class]="
                'relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ' +
                getDesktopNavClass(rla4.isActive)
              "
            >
              <svg
                class="w-3.5 h-3.5 shrink-0"
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
              <span>Simulator KPR</span>
            </a>
          </nav>

          <!-- Mobile Navigation (icon-only pill bar) -->
          <nav
            [class]="
              'flex md:hidden items-center gap-0.5 p-1 rounded-full border backdrop-blur-xl transition-all shadow-sm ' +
              (isHomePage
                ? 'bg-slate-900/60 border-white/15'
                : 'bg-slate-100/95 border-slate-200/90')
            "
            aria-label="Mobile Navigation"
          >
            <!-- Beranda -->
            <a
              [routerLink]="'/'"
              routerLinkActive="active-nav"
              [routerLinkActiveOptions]="{ exact: true }"
              #m0="routerLinkActive"
              [class]="
                'relative flex flex-col items-center justify-center gap-0.5 w-10 h-10 rounded-full transition-all active:scale-90 ' +
                getMobileNavClass(m0.isActive)
              "
              title="Beranda"
              aria-label="Beranda"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span class="text-[9px] font-bold leading-none">Home</span>
            </a>
            <!-- Jelajah -->
            <a
              [routerLink]="'/buy'"
              routerLinkActive="active-nav"
              #m1="routerLinkActive"
              [class]="
                'relative flex flex-col items-center justify-center gap-0.5 w-10 h-10 rounded-full transition-all active:scale-90 ' +
                getMobileNavClass(m1.isActive)
              "
              title="Jelajah Properti"
              aria-label="Jelajah Properti"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span class="text-[9px] font-bold leading-none">Jelajah</span>
            </a>
            <!-- Bandingkan -->
            <a
              [routerLink]="'/compare'"
              routerLinkActive="active-nav"
              #m2="routerLinkActive"
              [class]="
                'relative flex flex-col items-center justify-center gap-0.5 w-10 h-10 rounded-full transition-all active:scale-90 ' +
                getMobileNavClass(m2.isActive)
              "
              title="Bandingkan Properti"
              aria-label="Bandingkan Properti"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              <span class="text-[9px] font-bold leading-none">Kompar</span>
              @if (comparisonCount > 0) {
                <span
                  class="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center border-2 border-white"
                  >{{ comparisonCount }}</span
                >
              }
            </a>
            <!-- Favorit -->
            <a
              [routerLink]="'/favorites'"
              routerLinkActive="active-nav"
              #m3="routerLinkActive"
              [class]="
                'relative flex flex-col items-center justify-center gap-0.5 w-10 h-10 rounded-full transition-all active:scale-90 ' +
                getMobileNavClass(m3.isActive)
              "
              title="Favorit"
              aria-label="Favorit"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span class="text-[9px] font-bold leading-none">Favorit</span>
              @if (favoritesCount > 0) {
                <span
                  class="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center border-2 border-white"
                  >{{ favoritesCount }}</span
                >
              }
            </a>
            <!-- KPR -->
            <a
              [routerLink]="'/simulator/kpr'"
              routerLinkActive="active-nav"
              #m4="routerLinkActive"
              [class]="
                'relative flex flex-col items-center justify-center gap-0.5 w-10 h-10 rounded-full transition-all active:scale-90 ' +
                getMobileNavClass(m4.isActive)
              "
              title="Simulator KPR"
              aria-label="Simulator KPR"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span class="text-[9px] font-bold leading-none">KPR</span>
            </a>
          </nav>

          <!-- Desktop CTA Button -->
          <div class="hidden md:flex items-center gap-2">
            <a
              routerLink="/buy"
              [class]="
                'inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md active:scale-95 ' +
                (isHomePage
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20')
              "
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Cari Properti</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class SiteHeaderComponent {
  @Input() favoritesCount = 0;
  @Input() comparisonCount = 0;

  private router = inject(Router);

  get isHomePage(): boolean {
    return this.router.url === '/';
  }

  getDesktopNavClass(isActive: boolean): string {
    const hp = this.isHomePage;
    if (isActive)
      return hp ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-white shadow-sm';
    return hp
      ? 'text-slate-200 hover:text-white hover:bg-white/10'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
  }

  getMobileNavClass(isActive: boolean): string {
    const hp = this.isHomePage;
    if (isActive)
      return hp ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-900 text-white shadow-sm';
    return hp
      ? 'text-slate-300 hover:text-white hover:bg-white/10'
      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200';
  }
}
