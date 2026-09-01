import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { calculateKpr } from '../../../core/services/kpr.service';
import { KprInput, KprResult } from '../../../core/types/kpr.types';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs.component';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';

@Component({
  selector: 'app-kpr-simulator-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent, RupiahPipe],
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <app-breadcrumbs [items]="[{ label: 'Simulator KPR' }]" />

      <!-- Hero Header -->
      <section
        aria-label="Header Simulator KPR"
        class="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl"
      >
        <div
          class="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
        ></div>
        <div class="relative z-10 max-w-2xl">
          <div
            class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span>Kalkulator Finansial Standar Bank Indonesia</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Simulasi Angsuran &amp; Kelayakan KPR
          </h1>
          <p class="text-sm sm:text-base text-slate-300">
            Perhitungkan estimasi cicilan bulanan, rincian bunga, dan rekomendasi penghasilan
            minimum keluarga secara transparan dan akurat.
          </p>
        </div>
      </section>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Form Left -->
        <div
          class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
        >
          <form (submit)="$event.preventDefault()" class="space-y-6">
            <fieldset class="space-y-6">
              <legend
                class="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 w-full flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Parameter Pinjaman KPR</span>
              </legend>

              <!-- 1. Harga Properti -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label
                    for="kpr-property-price"
                    class="text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >Harga Properti (IDR)</label
                  >
                  <span class="text-sm font-extrabold text-blue-600">{{
                    propertyPrice() | rupiah
                  }}</span>
                </div>
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400"
                    >Rp</span
                  >
                  <input
                    id="kpr-property-price"
                    type="number"
                    min="50000000"
                    step="10000000"
                    [ngModel]="propertyPrice()"
                    (ngModelChange)="onPriceChange($event)"
                    name="propertyPrice"
                    class="w-full pl-12 pr-4 py-2.5 rounded-full border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                  />
                </div>
                <div class="flex gap-1.5 flex-wrap pt-1">
                  @for (
                    preset of [500000000, 750000000, 1000000000, 1500000000, 2500000000];
                    track preset
                  ) {
                    <button
                      type="button"
                      (click)="setPricePreset(preset)"
                      [class]="
                        'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ' +
                        (propertyPrice() === preset
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                      "
                    >
                      {{ preset | rupiah: true }}
                    </button>
                  }
                </div>
              </div>

              <!-- 2. Uang Muka DP -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label
                    for="kpr-dp-amount"
                    class="text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Uang Muka / DP ({{ downPaymentPercent() }}%)
                  </label>
                  <span class="text-sm font-bold text-slate-900">{{
                    downPaymentAmount() | rupiah
                  }}</span>
                </div>
                <div class="flex gap-2 sm:gap-3">
                  <div class="relative flex-1">
                    <span
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400"
                      >Rp</span
                    >
                    <input
                      id="kpr-dp-amount"
                      type="number"
                      min="0"
                      [max]="propertyPrice()"
                      step="5000000"
                      [ngModel]="downPaymentAmount()"
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
                        [class]="
                          'px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ' +
                          (downPaymentPercent() === pct
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                        "
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
                  [ngModel]="downPaymentPercent()"
                  (ngModelChange)="setPercent($event)"
                  name="dpRange"
                  class="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <!-- 3. Bunga & Tenor -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label
                    for="kpr-interest-rate"
                    class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>Suku Bunga (% per tahun)</span>
                  </label>
                  <input
                    id="kpr-interest-rate"
                    type="number"
                    min="1"
                    max="20"
                    step="0.1"
                    [ngModel]="interestRate()"
                    (ngModelChange)="interestRate.set($event)"
                    name="interestRate"
                    class="w-full px-4 py-2.5 rounded-full border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                  <div class="flex gap-1">
                    @for (rate of [4.75, 5.5, 6.75, 8.5]; track rate) {
                      <button
                        type="button"
                        (click)="interestRate.set(rate)"
                        [class]="
                          'flex-1 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 ' +
                          (interestRate() === rate
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                        "
                      >
                        {{ rate }}%
                      </button>
                    }
                  </div>
                </div>

                <div class="space-y-2">
                  <label
                    for="kpr-loan-duration"
                    class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>Jangka Waktu (Tahun)</span>
                  </label>
                  <input
                    id="kpr-loan-duration"
                    type="number"
                    min="1"
                    max="35"
                    step="1"
                    [ngModel]="loanDurationYears()"
                    (ngModelChange)="loanDurationYears.set($event)"
                    name="loanDurationYears"
                    class="w-full px-4 py-2.5 rounded-full border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                  <div class="flex gap-1">
                    @for (tenor of [10, 15, 20, 25]; track tenor) {
                      <button
                        type="button"
                        (click)="loanDurationYears.set(tenor)"
                        [class]="
                          'flex-1 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95 ' +
                          (loanDurationYears() === tenor
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                        "
                      >
                        {{ tenor }} Th
                      </button>
                    }
                  </div>
                </div>
              </div>
            </fieldset>
          </form>

          @if (!kprResult().isValid) {
            <div
              class="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1"
            >
              <div class="flex items-center gap-1.5 font-bold">
                <svg
                  class="w-4 h-4 text-red-600 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Harap periksa isian parameter:</span>
              </div>
              <ul class="list-disc list-inside pl-1 space-y-0.5">
                @for (err of kprResult().validationErrors; track err) {
                  <li>{{ err }}</li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Result Card Right -->
        <div class="lg:col-span-5 space-y-6">
          <aside
            aria-label="Hasil Kalkulasi Angsuran"
            class="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
          >
            <div class="pb-4 border-b border-slate-800">
              <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider block"
                >Estimasi Cicilan Bulanan</span
              >
              <div class="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {{ kprResult().monthlyInstallment | rupiah }}
                <span class="text-sm font-medium text-slate-400"> / bulan</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">
                Tenor {{ kprResult().loanDurationYears }} tahun ({{
                  kprResult().loanDurationMonths
                }}
                bulan angsuran)
              </p>
            </div>

            <div class="space-y-3 text-xs sm:text-sm">
              <div class="flex justify-between items-center text-slate-300">
                <span>Pokok Pinjaman KPR:</span>
                <span class="font-bold text-white">{{ kprResult().loanPrincipal | rupiah }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-300">
                <span>Uang Muka (DP {{ kprResult().downPaymentPercent.toFixed(0) }}%):</span>
                <span class="font-bold text-white">{{
                  kprResult().downPaymentAmount | rupiah
                }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-300">
                <span>Estimasi Total Bunga:</span>
                <span class="font-bold text-amber-400">{{
                  kprResult().totalInterest | rupiah
                }}</span>
              </div>
              <div
                class="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800"
              >
                <span>Total Pengembalian:</span>
                <span class="font-extrabold text-white">{{
                  kprResult().totalPayment | rupiah
                }}</span>
              </div>
            </div>

            <div
              class="p-4 rounded-2xl bg-blue-950/80 border border-blue-800/80 space-y-1.5 text-xs"
            >
              <div class="flex items-center gap-2 text-blue-300 font-bold">
                <svg
                  class="w-4 h-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span>Rekomendasi Penghasilan Keluarga:</span>
              </div>
              <p class="text-lg font-black text-white">
                ~ {{ kprResult().recommendedMinimumIncome | rupiah }} / bulan
              </p>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Berdasarkan standar rasio cicilan maksimal 33% (Debt Service Ratio) untuk kemudahan
                persetujuan bank.
              </p>
            </div>

            <button
              type="button"
              (click)="navigate('/buy')"
              class="w-full inline-flex items-center justify-center font-bold text-base px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
            >
              Cari Properti Sesuai Budget KPR
            </button>
          </aside>
        </div>
      </div>

      <!-- Amortization Schedule Table -->
      @if (kprResult().schedule.length > 0) {
        <section
          aria-label="Tabel Amortisasi Tahunan"
          class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100"
          >
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Jadwal Amortisasi Pinjaman (Tahun ke Tahun)
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Rincian proporsi pokok angsuran vs beban bunga serta sisa pinjaman setiap akhir
                periode tahun.
              </p>
            </div>
            <button
              type="button"
              (click)="showSchedule.set(!showSchedule())"
              class="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
            >
              <span>{{ showSchedule() ? 'Sembunyikan Tabel' : 'Tampilkan Detail' }}</span>
              <svg
                class="w-3.5 h-3.5"
                [class.rotate-180]="showSchedule()"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          @if (showSchedule()) {
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-700 border-collapse">
                <caption class="sr-only">
                  Rincian Amortisasi Tahunan KPR
                </caption>
                <thead>
                  <tr
                    class="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase tracking-wider text-[11px]"
                  >
                    <th scope="col" class="py-3 px-4">Tahun Ke</th>
                    <th scope="col" class="py-3 px-4">Pokok Dibayar (Tahun)</th>
                    <th scope="col" class="py-3 px-4">Bunga Dibayar (Tahun)</th>
                    <th scope="col" class="py-3 px-4">Sisa Pokok Pinjaman</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (row of kprResult().schedule; track row.year) {
                    <tr class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-3 px-4 font-bold text-slate-900">Tahun {{ row.year }}</td>
                      <td class="py-3 px-4 text-emerald-600 font-semibold">
                        {{ row.principalPaidYear | rupiah }}
                      </td>
                      <td class="py-3 px-4 text-amber-600 font-semibold">
                        {{ row.interestPaidYear | rupiah }}
                      </td>
                      <td class="py-3 px-4 font-bold text-slate-800">
                        {{ row.remainingPrincipal | rupiah }}
                      </td>
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly propertyPrice = signal(850000000);
  readonly downPaymentPercent = signal(20);
  readonly downPaymentAmount = signal(170000000);
  readonly interestRate = signal(5.5);
  readonly loanDurationYears = signal(20);
  readonly showSchedule = signal(false);

  readonly kprResult = computed<KprResult>(() => {
    const input: KprInput = {
      propertyPrice: this.propertyPrice(),
      downPaymentPercent: this.downPaymentPercent(),
      downPaymentAmount: this.downPaymentAmount(),
      interestRateAnnualPercent: this.interestRate(),
      loanDurationYears: this.loanDurationYears(),
    };
    return calculateKpr(input);
  });

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

  setPercent(pct: number): void {
    this.downPaymentPercent.set(pct);
    this.downPaymentAmount.set(Math.round((this.propertyPrice() * pct) / 100));
  }

  onPriceChange(val: number): void {
    this.propertyPrice.set(val);
    this.downPaymentAmount.set(Math.round((val * this.downPaymentPercent()) / 100));
  }

  setPricePreset(preset: number): void {
    this.onPriceChange(preset);
  }

  onDpAmountChange(amt: number): void {
    this.downPaymentAmount.set(amt);
    if (this.propertyPrice() > 0) {
      this.downPaymentPercent.set(parseFloat(((amt / this.propertyPrice()) * 100).toFixed(1)));
    }
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
