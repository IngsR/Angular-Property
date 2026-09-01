import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// Profil pemilik — sesuaikan data di sini
const OWNER = {
  name: 'Ikhwan Ramadhan',
  title: 'Frontend Engineer',
  tagline:
    'Lulusan S1 Teknik Informatika UPI "YPTK" Padang, dengan spesialisasi pada Frontend Engineering. Menguasai React.js dan TypeScript dengan fokus utama pada Next.js dan Angular.',
  email: 'ikhwn.rdn@gmail.com',
  phone: '+6282386473410',
  whatsappUrl:
    'https://wa.me/6282386473410?text=Halo%20Ikhwan%2C%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berdiskusi%20terkait%20peluang%20kerja%20Frontend%20Engineer%20%2F%20proyek.',
  website: 'https://ikhwann.my.id',
  socials: [
    { name: 'GitHub', url: 'https://github.com/IngsR' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ikhwn-rdn' },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/6282386473410?text=Halo%20Ikhwan%2C%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berdiskusi%20terkait%20peluang%20kerja%20Frontend%20Engineer%20%2F%20proyek.',
    },
  ],
};

const NAV_ITEMS: { path: string; label: string }[] = [
  { path: '/', label: 'Beranda' },
  { path: '/buy', label: 'Jelajah Properti' },
  { path: '/compare', label: 'Bandingkan' },
  { path: '/favorites', label: 'Favorit' },
  { path: '/simulator/kpr', label: 'Simulator KPR' },
];

// Link eksternal portofolio
const PORTFOLIO_URL = 'https://ikhwann.my.id';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  template: `
    <footer class="mt-12 border-t border-slate-800 bg-slate-900 text-slate-300 sm:mt-14">
      <div class="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <!-- Grid utama: Brand | Navigasi | Kontak -->
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-12">
          <!-- Brand (5 kolom) -->
          <div class="space-y-4 sm:col-span-2 lg:col-span-5">
            <div class="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Logo HouseING Property"
                width="44"
                height="44"
                loading="lazy"
                class="h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm sm:h-11 sm:w-11 border border-slate-700"
              />
              <div class="min-w-0">
                <h3 class="truncate text-[15px] font-bold leading-tight text-white sm:text-base">
                  HouseING Property oleh Ikhwan Ramadhan
                </h3>
                <a
                  [href]="portfolioUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-0.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ikhwann.my.id ↗
                </a>
              </div>
            </div>

            <p class="max-w-sm text-[13px] leading-6 text-slate-400 sm:text-sm">
              {{ owner.tagline }}
            </p>
            <p class="text-xs text-slate-500">Portofolio Frontend Engineer: Ikhwan Ramadhan</p>

            <!-- Social links -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              @for (social of owner.socials; track social.name) {
                <a
                  [href]="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-[13px] font-medium text-slate-400 transition-colors hover:text-white"
                >
                  <span>{{ social.name }}</span>
                  <!-- ExternalLink icon -->
                  <svg
                    class="h-3 w-3 shrink-0 opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              }
            </div>
          </div>

          <!-- Navigasi (3 kolom) -->
          <div class="space-y-3 sm:col-span-1 lg:col-span-3">
            <h4 class="text-xs font-bold uppercase tracking-[0.12em] text-white">Menu Navigasi</h4>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-1">
              @for (item of navItems; track item.path) {
                <button
                  type="button"
                  (click)="navigate(item.path)"
                  class="flex min-h-[36px] items-center justify-center rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-[12px] font-medium text-slate-300 transition-all duration-200 hover:border-slate-500 hover:bg-slate-700 hover:text-white active:scale-[0.98] lg:justify-start lg:px-3.5"
                >
                  {{ item.label }}
                </button>
              }
            </div>
          </div>

          <!-- Kontak (4 kolom) -->
          <div class="space-y-3 sm:col-span-1 lg:col-span-4">
            <h4 class="text-xs font-bold uppercase tracking-[0.12em] text-white">Kontak Cepat</h4>

            <div class="space-y-3">
              <!-- Email -->
              <div class="space-y-0.5">
                <p class="text-[11px] font-medium text-slate-500">Email</p>
                <a
                  [href]="'mailto:' + owner.email"
                  class="block break-all text-[13px] font-semibold text-white transition-colors hover:text-slate-300 hover:underline"
                >
                  {{ owner.email }}
                </a>
              </div>

              <!-- WhatsApp -->
              <div class="space-y-0.5">
                <p class="text-[11px] font-medium text-slate-500">WhatsApp</p>
                <a
                  [href]="owner.whatsappUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex text-[13px] font-semibold text-emerald-400 transition-colors hover:underline"
                >
                  {{ owner.phone }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom bar -->
        <div
          class="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-[11px] text-slate-500 sm:text-[12px]">
            &copy; {{ currentYear }} {{ owner.name }}. All rights reserved.
          </p>
          <button
            type="button"
            (click)="scrollToTop()"
            class="inline-flex w-fit items-center gap-1.5 text-[12px] font-medium text-slate-400 transition-colors hover:text-white"
          >
            <span>Kembali ke atas</span>
            <!-- ArrowUp icon -->
            <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooterComponent {
  private router = inject(Router);

  readonly owner = OWNER;
  readonly navItems = NAV_ITEMS;
  readonly portfolioUrl = PORTFOLIO_URL;
  readonly currentYear = new Date().getFullYear();

  navigate(path: string): void {
    const [pathname, search] = path.split('?');
    if (search) {
      const params: Record<string, string> = {};
      new URLSearchParams(search).forEach((v, k) => (params[k] = v));
      this.router.navigate([pathname], { queryParams: params });
    } else {
      this.router.navigate([pathname]);
    }
    this.scrollToTop();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
