import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ComparisonService } from '../../core/services/comparison.service';
import { NotificationService } from '../../core/services/notification.service';
import { PropertyService } from '../../core/services/property.service';
import { Property } from '../../core/types/property.types';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs.component';
import { RupiahPipe } from '../../shared/pipes/rupiah.pipe';
import { EmptyStateComponent } from '../../shared/ui/empty.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { formatRupiah } from '../../shared/utils/formatters';

@Component({
  selector: 'app-comparison-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BreadcrumbsComponent, EmptyStateComponent, ModalComponent, RupiahPipe],
  template: `
    <main class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <app-breadcrumbs [items]="[{ label: 'Komparasi Properti' }]" />

      @if (properties().length === 0 && !loading()) {
        <div class="py-12">
          <app-empty-state
            title="Belum Ada Properti yang Dibandingkan"
            description="Pilih 2 properti dari katalog untuk membandingkan harga, spesifikasi arsitektur, dan simulasi cicilan KPR secara objektif."
            actionText="Jelajah & Pilih Properti"
            (actionClicked)="navigate('/buy')"
          />
        </div>
      } @else {
        <!-- Page Header Bar -->
        <section
          class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 shrink-0"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <div>
              <h1
                class="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2"
              >
                <span>Matriks Komparasi Properti</span>
                <span
                  class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60"
                >
                  {{ properties().length }}/2
                </span>
              </h1>
              <p class="text-xs text-slate-500 font-medium hidden sm:block">
                Perbandingan objektif spesifikasi fisik, denah, dan estimasi finansial antara 2
                properti pilihan
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 self-start sm:self-auto">
            @if (properties().length < 2) {
              <button
                type="button"
                (click)="isAddModalOpen.set(true)"
                class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Tambah Properti ke-2</span>
              </button>
            }
            @if (properties().length > 0) {
              <button
                type="button"
                (click)="clearAll()"
                class="flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Reset</span>
              </button>
            }
          </div>
        </section>

        <!-- Notice when only 1 property selected -->
        @if (properties().length < 2) {
          <div
            class="bg-blue-50/90 border border-blue-200 p-4 rounded-3xl text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div class="flex items-center gap-2">
              <span class="text-base">💡</span>
              <span
                >Pilih <strong>1 properti lagi</strong> dari katalog untuk melihat perbandingan
                matriks 2 properti secara berdampingan.</span
              >
            </div>
            <button
              type="button"
              (click)="isAddModalOpen.set(true)"
              class="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all active:scale-95 shrink-0 shadow-xs"
            >
              + Pilih Properti Kedua
            </button>
          </div>
        }

        <!-- 2-COLUMN SIDE-BY-SIDE CARDS -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3 sm:gap-6">
            <!-- Card 1 (Properti A) -->
            @if (propA()) {
              <div
                class="bg-white rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
              >
                <button
                  type="button"
                  (click)="removeProperty(propA()!.id)"
                  class="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors shadow-xs"
                  title="Hapus dari perbandingan"
                  aria-label="Hapus properti 1"
                >
                  <svg
                    class="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                </button>

                <div class="space-y-3">
                  <div class="h-32 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img
                      [src]="propA()!.images[0]?.url"
                      [alt]="propA()!.title"
                      class="w-full h-full object-cover"
                      referrerpolicy="no-referrer"
                    />
                    <span
                      class="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-black uppercase shadow-xs"
                      >Properti 1</span
                    >
                  </div>
                  <div>
                    <span
                      class="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider block truncate"
                      >{{ propA()!.propertyTypeName }}</span
                    >
                    <h2
                      (click)="navigate('/property/' + propA()!.slug)"
                      class="text-xs sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {{ propA()!.title }}
                    </h2>
                    <p class="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                      {{ propA()!.location.city }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    (click)="navigate('/property/' + propA()!.slug)"
                    class="flex-1 py-2 px-3 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>Buka Detail</span>
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    (click)="navigate('/simulator/kpr?price=' + propA()!.price)"
                    class="hidden sm:flex py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 items-center justify-center gap-1"
                  >
                    <svg
                      class="w-3.5 h-3.5 text-blue-600"
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
                    <span>KPR</span>
                  </button>
                </div>
              </div>
            }

            <!-- Card 2 (Properti B) -->
            @if (propB()) {
              <div
                class="bg-white rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
              >
                <button
                  type="button"
                  (click)="removeProperty(propB()!.id)"
                  class="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors shadow-xs"
                  title="Hapus dari perbandingan"
                  aria-label="Hapus properti 2"
                >
                  <svg
                    class="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                </button>

                <div class="space-y-3">
                  <div class="h-32 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img
                      [src]="propB()!.images[0]?.url"
                      [alt]="propB()!.title"
                      class="w-full h-full object-cover"
                      referrerpolicy="no-referrer"
                    />
                    <span
                      class="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] sm:text-xs font-black uppercase shadow-xs"
                      >Properti 2</span
                    >
                  </div>
                  <div>
                    <span
                      class="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider block truncate"
                      >{{ propB()!.propertyTypeName }}</span
                    >
                    <h2
                      (click)="navigate('/property/' + propB()!.slug)"
                      class="text-xs sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {{ propB()!.title }}
                    </h2>
                    <p class="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                      {{ propB()!.location.city }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    (click)="navigate('/property/' + propB()!.slug)"
                    class="flex-1 py-2 px-3 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>Buka Detail</span>
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    (click)="navigate('/simulator/kpr?price=' + propB()!.price)"
                    class="hidden sm:flex py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 items-center justify-center gap-1"
                  >
                    <svg
                      class="w-3.5 h-3.5 text-indigo-600"
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
                    <span>KPR</span>
                  </button>
                </div>
              </div>
            } @else {
              <!-- Slot 2 Empty -->
              <div
                class="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center space-y-3"
              >
                <div
                  class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-800">Slot Properti 2 Kosong</p>
                  <p class="text-xs text-slate-500 mt-0.5">Pilih properti kedua untuk komparasi</p>
                </div>
                <button
                  type="button"
                  (click)="isAddModalOpen.set(true)"
                  class="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs active:scale-95 hover:bg-blue-600 transition-all"
                >
                  + Pilih Properti
                </button>
              </div>
            }
          </div>

          <!-- Synchronized Metrics Comparison Grid -->
          @if (propA()) {
            <div
              class="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs divide-y divide-slate-100"
            >
              @for (attrA of getAttributes(propA()!); track attrA.key; let idx = $index) {
                <div class="p-3.5 sm:p-5 space-y-2.5">
                  <div
                    class="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800"
                  >
                    <span class="text-blue-600 shrink-0" [innerHTML]="attrA.svg"></span>
                    <span>{{ attrA.label }}</span>
                  </div>

                  <div class="grid grid-cols-2 gap-2.5 sm:gap-4 text-xs sm:text-sm">
                    <!-- Column 1 (Prop A) -->
                    <div
                      [class]="
                        'p-3 sm:p-4 rounded-2xl ' +
                        (attrA.isHighlight
                          ? 'bg-blue-50/80 text-blue-950 font-black border border-blue-100'
                          : 'bg-slate-50 text-slate-800 font-semibold')
                      "
                    >
                      <span
                        class="text-[10px] text-blue-600 block font-bold mb-0.5 uppercase tracking-wider"
                        >Properti 1</span
                      >
                      <div class="text-xs sm:text-base font-extrabold">{{ attrA.value }}</div>
                      @if (attrA.subtext) {
                        <div class="text-[10px] text-slate-500 font-normal mt-1 leading-tight">
                          {{ attrA.subtext }}
                        </div>
                      }
                    </div>

                    <!-- Column 2 (Prop B) -->
                    @if (propB()) {
                      @let attrB = getAttributes(propB()!)[idx];
                      <div
                        [class]="
                          'p-3 sm:p-4 rounded-2xl ' +
                          (attrB.isHighlight
                            ? 'bg-indigo-50/80 text-indigo-950 font-black border border-indigo-100'
                            : 'bg-slate-50 text-slate-800 font-semibold')
                        "
                      >
                        <span
                          class="text-[10px] text-indigo-600 block font-bold mb-0.5 uppercase tracking-wider"
                          >Properti 2</span
                        >
                        <div class="text-xs sm:text-base font-extrabold">{{ attrB.value }}</div>
                        @if (attrB.subtext) {
                          <div class="text-[10px] text-slate-500 font-normal mt-1 leading-tight">
                            {{ attrB.subtext }}
                          </div>
                        }
                      </div>
                    } @else {
                      <div
                        class="p-3 sm:p-4 rounded-2xl bg-slate-50 text-slate-400 italic text-xs flex items-center justify-center border border-dashed border-slate-200"
                      >
                        Belum ada properti ke-2
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Add Property Modal -->
      <app-modal
        [isOpen]="isAddModalOpen()"
        (closed)="isAddModalOpen.set(false)"
        title="Pilih Properti Kedua untuk Komparasi"
        maxWidth="2xl"
      >
        <div class="space-y-3">
          @if (availableToAdd().length === 0) {
            <p class="text-sm text-slate-500 text-center py-6">
              Tidak ada properti lain yang tersedia dalam katalog.
            </p>
          } @else {
            @for (prop of availableToAdd(); track prop.id) {
              <div
                class="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-blue-500 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <img
                    [src]="prop.images[0]?.url"
                    [alt]="prop.title"
                    class="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h4 class="text-sm font-bold text-slate-900">{{ prop.title }}</h4>
                    <p class="text-xs text-slate-500">
                      {{ prop.location.city }} • {{ prop.price | rupiah }}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  (click)="addProperty(prop.id)"
                  class="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xs flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Pilih</span>
                </button>
              </div>
            }
          }
        </div>
      </app-modal>
    </main>
  `,
})
export class ComparisonPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);
  private readonly compSvc = inject(ComparisonService);
  private readonly notifSvc = inject(NotificationService);

  readonly properties = signal<Property[]>([]);
  readonly allProperties = signal<Property[]>([]);
  readonly loading = signal(true);
  readonly isAddModalOpen = signal(false);

  readonly propA = computed(() => this.properties()[0] || null);
  readonly propB = computed(() => this.properties()[1] || null);

  readonly availableToAdd = computed(() => {
    const currentIds = this.properties().map((p) => p.id);
    return this.allProperties().filter((p) => !currentIds.includes(p.id));
  });

  async ngOnInit(): Promise<void> {
    await this.refreshData();
  }

  async refreshData(): Promise<void> {
    this.loading.set(true);
    const activeList = this.compSvc.getComparisonList().slice(0, 2);
    const [comparedData, allData] = await Promise.all([
      this.propertyService.getPropertiesByIds(activeList),
      this.propertyService.getProperties({ limit: 30 }),
    ]);
    this.properties.set(comparedData);
    this.allProperties.set(allData.properties);
    this.loading.set(false);
  }

  getAttributes(prop: Property) {
    const monthlyKpr = Math.round(
      (prop.price * 0.8 * (0.055 / 12)) / (1 - Math.pow(1 + 0.055 / 12, -240)),
    );

    return [
      {
        key: 'price',
        label: 'Harga Jual Properti',
        value: formatRupiah(prop.price),
        isHighlight: true,
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
      },
      {
        key: 'kpr',
        label: 'Estimasi Cicilan KPR',
        value: `~${formatRupiah(monthlyKpr, true)}/bln`,
        subtext: 'DP 20% • Bunga 5.5% • 20 Thn',
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
      },
      {
        key: 'city',
        label: 'Wilayah / Lokasi',
        value: `${prop.location.district ? prop.location.district + ', ' : ''}${prop.location.city}`,
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
      },
      {
        key: 'lb',
        label: 'Luas Bangunan (LB)',
        value: `${prop.specification.buildingArea} m²`,
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>',
      },
      {
        key: 'lt',
        label: 'Luas Tanah (LT)',
        value: `${prop.specification.landArea} m²`,
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>',
      },
      {
        key: 'rooms',
        label: 'Kamar Tidur / Mandi',
        value: `${prop.specification.bedrooms} KT • ${prop.specification.bathrooms} KM`,
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
      },
      {
        key: 'floors',
        label: 'Tingkat Lantai & Parkir',
        value: `${prop.specification.floors} Lantai • ${prop.specification.parking} Mobil`,
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      },
      {
        key: 'cert',
        label: 'Legalitas Sertifikat',
        value: prop.specification.certificate || 'SHM (Hak Milik)',
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      },
      {
        key: 'developer',
        label: 'Pengembang / Mitra',
        value: prop.partner?.name || 'Mitra Mandiri Terverifikasi',
        svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
      },
    ];
  }

  async addProperty(id: string): Promise<void> {
    const res = this.compSvc.add(id);
    if (res.success) {
      this.notifSvc.show(res.message || 'Properti ditambahkan ke perbandingan', 'success');
      this.isAddModalOpen.set(false);
      await this.refreshData();
    } else {
      this.notifSvc.show(res.message || 'Gagal menambahkan', 'warning');
    }
  }

  async removeProperty(id: string): Promise<void> {
    this.compSvc.remove(id);
    this.notifSvc.show('Properti dihapus dari perbandingan', 'info');
    await this.refreshData();
  }

  async clearAll(): Promise<void> {
    this.compSvc.clear();
    this.notifSvc.show('Perbandingan telah direset', 'info');
    await this.refreshData();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
