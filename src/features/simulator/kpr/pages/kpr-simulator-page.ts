import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { calculateKpr } from '../../../../core/services/kpr.service';
import { KprInput, KprResult } from '../../../../core/types/kpr.types';
import { formatRupiah } from '../../../../shared/utils/formatters';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs';
import { RupiahPipe } from '../../../../shared/pipes/rupiah.pipe';

@Component({
  selector: 'app-kpr-simulator-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent, RupiahPipe],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <app-breadcrumbs [items]="[{ label: 'Simulator KPR' }]" />

      <!-- Hero Header -->
      <section class="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
        <div class="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span>Kalkulator Finansial Standar Bank Indonesia</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">Simulasi Angsuran &amp; Kelayakan KPR</h1>
          <p class="text-sm sm:text-base text-slate-300">
            Perhitungkan estimasi cicilan bulanan, rincian bunga, dan rekomendasi penghasilan minimum keluarga secara transparan dan akurat.
          </p>
        </div>
      </section>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Form Left -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <form (submit)="$event.preventDefault()" class="space-y-6">
            <fieldset class="space-y-6">
              <legend class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 w-full flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Parameter Pinjaman KPR</span>
              </legend>

              <!-- 1. Harga Properti -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label for="kpr-property-price" class="text-xs font-bold text-slate-700 uppercase tracking-wider">Harga Properti (IDR)</label>
                  <span class="text-sm font-extrabold text-blue-600">{{ propertyPrice | rupiah }}</span>
                </div>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                  <input
                    id="kpr-property-price"
                    type="number"
                    min="50000000"
                    step="10000000"
                    [(ngModel)]="propertyPrice"
                    (ngModelChange)="onPriceChange($event)"
                    name="propertyPrice"
                    class="w-full pl-12 pr-4 py-2.5 rounded-full border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                  />
                </div>
                <div class="flex gap-1.5 flex-wrap pt-1">
                  @for (preset of [500000000, 750000000, 1000000000, 1500000000, 2500000000]; track preset) {
                    <button
                      type="button"
                      (click)="setPricePreset(preset)"
                      [class]="'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ' + (propertyPrice === preset ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')"
                    >
                      {{ preset | rupiah:true }}
                    </button>
                  }
                </div>
              </div>

              <!-- 2. Uang Muka DP -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label for="kpr-dp-amount" class="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Uang Muka / DP ({{ downPaymentPercent }}%)
                  </label>
                  <span class="text-sm font-bold text-slate-900">{{ downPaymentAmount | rupiah }}</span>
                </div>
                <div class="flex gap-2 sm:gap-3">
                  <div class="relative flex-1">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                    <input
                      id="kpr-dp-amount"
                      type="number"
                      min="0"
                      [max]="propertyPrice"
                      step="5000000"
                      [(ngModel)]="downPaymentAmount"
                      (ngModelChange)="onDpAmountChange($event)"
                      name="downPaymentAmount"
                      class="w-full pl-12 pr-4 py-2.5 rounded-full border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    @for (pct of [10, 20, 30]; track pct) {
                      <button
                        type="button"
                        (click)="setPercent(pct)"
                        [class]="'px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ' + (downPaymentPercent === pct ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')"
                      >
                        {{ pct }}%
                      </button>
                    }
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  [(ngModel)]="downPaymentPercent"
                  (ngModelChange)="setPercent($event)"
                  name="dpRange"
                  class="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <!-- 3. Bunga & Tenor -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="kpr-interest-rate" class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <span>Suku Bunga (% per tahun)</span>
                  </label>
                  <input
                    id="kpr-interest-rate"
                    type="number"
                    min="1"
                    max="20"
                    step="0.1"
                    [(ngModel)]="interestRate"
                    name="interestRate"
                    class="w-full px-4 py-2.5 rounded-full border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                  <div class="flex gap-1">
                    @for (rate of [4.75, 5.5, 6.75, 8.5]; track rate) {
                      <button
                        type="button"
                        (click)="interestRate = rate"
                        [class]="'flex-1 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 ' + (interestRate === rate ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')"
                      >
                        {{ rate }}%
                      </button>
                    }
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="kpr-loan-duration" class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <span>Jangka Waktu (Tahun)</span>
                  </label>
                  <input
                    id="kpr-loan-duration"
                    type="number"
                    min="1"
                    max="35"
                    step="1"
                    [(ngModel)]="loanDurationYears"
                    name="loanDurationYears"
                    class="w-full px-4 py-2.5 rounded-full border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                  <div class="flex gap-1">
                    @for (tenor of [10, 15, 20, 25]; track tenor) {
                      <button
                        type="button"
                        (click)="loanDurationYears = tenor"
                        [class]="'flex-1 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 ' + (loanDurationYears === tenor ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')"
                      >
                        {{ tenor }} Th
                      </button>
                    }
                  </div>
                </div>
              </div>
            </fieldset>
          </form>

          @if (!kprResult.isValid) {
            <div class="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
              <div class="flex items-center gap-1.5 font-bold">
                <svg class="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <span>Harap periksa isian parameter:</span>
              </div>
              <ul class="list-disc list-inside pl-1 space-y-0.5">
                @for (err of kprResult.validationErrors; track err) {
                  <li>{{ err }}</li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Result Card Right -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div class="pb-4 border-b border-slate-800">
              <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Estimasi Cicilan Bulanan</span>
              <div class="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {{ kprResult.monthlyInstallment | rupiah }}
                <span class="text-sm font-medium text-slate-400"> / bulan</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">Tenor {{ kprResult.loanDurationYears }} tahun ({{ kprResult.loanDurationMonths }} bulan angsuran)</p>
            </div>

            <div class="space-y-3 text-xs sm:text-sm">
              <div class="flex justify-between items-center text-slate-300">
                <span>Pokok Pinjaman KPR:</span>
                <span class="font-bold text-white">{{ kprResult.loanPrincipal | rupiah }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-300">
                <span>Uang Muka (DP {{ kprResult.downPaymentPercent.toFixed(0) }}%):</span>
                <span class="font-bold text-white">{{ kprResult.downPaymentAmount | rupiah }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-300">
                <span>Estimasi Total Bunga:</span>
                <span class="font-bold text-amber-400">{{ kprResult.totalInterest | rupiah }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                <span>Total Pengembalian:</span>
                <span class="font-extrabold text-white">{{ kprResult.totalPayment | rupiah }}</span>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-blue-950/80 border border-blue-800/80 space-y-1.5 text-xs">
              <div class="flex items-center gap-2 text-blue-300 font-bold">
                <svg class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                <span>Rekomendasi Penghasilan Keluarga:</span>
              </div>
              <p class="text-lg font-black text-white">~ {{ kprResult.recommendedMinimumIncome | rupiah }} / bulan</p>
              <p class="text-[11px] text-slate-400 leading-relaxed">Berdasarkan standar rasio cicilan maksimal 33% (Debt Service Ratio) untuk kemudahan persetujuan bank.</p>
            </div>

            <button
              type="button"
              (click)="navigate('/buy')"
              class="w-full inline-flex items-center justify-center font-bold text-base px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
            >
              Cari Properti Sesuai Budget KPR
            </button>
          </div>
        </div>
      </div>

      <!-- Amortization Schedule Table -->
      @if (kprResult.schedule.length > 0) {
        <section aria-labelledby="schedule-heading" class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 id="schedule-heading" class="text-lg font-bold text-slate-900">Jadwal Amortisasi Tahunan Pinjaman KPR</h2>
              <p class="text-xs text-slate-500 mt-0.5">Rincian porsi pembayaran pokok versus bunga dari tahun pertama hingga akhir tenor.</p>
            </div>
            <button
              type="button"
              (click)="showSchedule = !showSchedule"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-xs"
            >
              <span>{{ showSchedule ? 'Sembunyikan Tabel' : 'Tampilkan Detail' }}</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="showSchedule ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/></svg>
            </button>
          </div>

          @if (showSchedule) {
            <div class="overflow-x-auto pt-2 animate-fade-in">
              <table class="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th class="p-3">Tahun Ke</th>
                    <th class="p-3">Porsi Pokok Terbayar</th>
                    <th class="p-3">Porsi Bunga Terbayar</th>
                    <th class="p-3">Sisa Pokok Pinjaman</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  @for (item of kprResult.schedule; track item.year) {
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="p-3 font-bold text-slate-900">Tahun {{ item.year }}</td>
                      <td class="p-3 font-semibold text-emerald-600">{{ item.principalPaidYear | rupiah }}</td>
                      <td class="p-3 text-slate-600">{{ item.interestPaidYear | rupiah }}</td>
                      <td class="p-3 font-bold text-slate-900">{{ item.remainingPrincipal | rupiah }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }
    </main>
  `,
})
export class KprSimulatorPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  propertyPrice = 850000000;
  downPaymentPercent = 20;
  downPaymentAmount = 170000000;
  interestRate = 5.5;
  loanDurationYears = 20;
  showSchedule = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['price']) {
        const p = Number(params['price']);
        if (!isNaN(p) && p > 0) {
          this.onPriceChange(p);
        }
      }
    });
  }

  get kprResult(): KprResult {
    const input: KprInput = {
      propertyPrice: this.propertyPrice,
      downPaymentPercent: this.downPaymentPercent,
      downPaymentAmount: this.downPaymentAmount,
      interestRateAnnualPercent: this.interestRate,
      loanDurationYears: this.loanDurationYears,
    };
    return calculateKpr(input);
  }

  setPercent(pct: number): void {
    this.downPaymentPercent = pct;
    this.downPaymentAmount = Math.round((this.propertyPrice * pct) / 100);
  }

  onPriceChange(val: number): void {
    this.propertyPrice = val;
    this.downPaymentAmount = Math.round((val * this.downPaymentPercent) / 100);
  }

  setPricePreset(preset: number): void {
    this.onPriceChange(preset);
  }

  onDpAmountChange(amt: number): void {
    this.downPaymentAmount = amt;
    if (this.propertyPrice > 0) {
      this.downPaymentPercent = parseFloat(((amt / this.propertyPrice) * 100).toFixed(1));
    }
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
