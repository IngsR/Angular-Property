import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property, PropertyImage, ImageCategory, PropertySpecification, Facility, FloorPlan, FloorPlanRoom, Location } from '../../../core/types/property.types';
import { propertyRepository } from '../../../core/repositories/property.repository';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs';
import { PropertyCardComponent } from '../../discovery/components/property-card';
import { SkeletonComponent } from '../../../shared/ui/skeleton';
import { EmptyStateComponent } from '../../../shared/ui/empty-state';
import { RupiahPipe } from '../../../shared/pipes/rupiah.pipe';
import { formatRupiah } from '../../../shared/utils/formatters';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ComparisonService } from '../../../core/services/comparison.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-property-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbsComponent, PropertyCardComponent, SkeletonComponent, EmptyStateComponent, RupiahPipe],
  template: `
    @if (loading()) {
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <app-skeleton extraClass="h-6 w-64" />
        <app-skeleton extraClass="h-10 w-3/4" />
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <app-skeleton extraClass="h-[400px] w-full rounded-2xl" />
            <app-skeleton extraClass="h-48 w-full rounded-2xl" />
          </div>
          <div class="space-y-4">
            <app-skeleton extraClass="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    } @else if (!property()) {
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <app-empty-state
          title="Properti Tidak Ditemukan"
          description="Properti yang Anda cari mungkin sudah tidak tersedia atau tautan yang Anda gunakan tidak valid."
          actionText="Kembali ke Katalog Properti"
          (actionClicked)="navigate('/buy')"
        />
      </main>
    } @else {
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <!-- Breadcrumbs -->
        <app-breadcrumbs
          [items]="[
            { label: 'Jelajah Properti', path: '/buy' },
            { label: property()!.location.city, path: '/buy?city=' + property()!.location.city },
            { label: property()!.title }
          ]"
        />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <!-- Main Content -->
          <article class="lg:col-span-2 space-y-10">

            <!-- 1. Header Identity -->
            <header class="space-y-3 pb-6 border-b border-slate-200">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">{{ property()!.propertyTypeName }}</span>
                <span [class]="'px-3 py-1 rounded-full text-xs font-bold ' + (property()!.availability === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : property()!.availability === 'LIMITED' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800')">
                  {{ property()!.availability === 'AVAILABLE' ? 'Tersedia Siap Huni' : property()!.availability === 'LIMITED' ? 'Unit Terbatas' : 'Terjual' }}
                </span>
                @if (property()!.partner?.verified) {
                  <span class="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Developer Terverifikasi
                  </span>
                }
                @if (property()!.specification.certificate) {
                  <span class="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border border-slate-300 bg-white text-slate-700">
                    <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {{ property()!.specification.certificate }}
                  </span>
                }
              </div>

              @if (property()!.project) {
                <div class="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50/80 px-3 py-1 rounded-lg w-fit">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  <span>Bagian dari Project: {{ property()!.project!.name }}</span>
                </div>
              }

              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{{ property()!.title }}</h1>
              @if (property()!.tagline) {
                <p class="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">{{ property()!.tagline }}</p>
              }

              <div class="flex items-center gap-2 text-sm text-slate-600 pt-1">
                <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>{{ property()!.location.address }}, {{ property()!.location.district ? property()!.location.district + ', ' : '' }}{{ property()!.location.city }}, {{ property()!.location.province }}</span>
              </div>
            </header>

            <!-- 2. Gallery -->
            <section class="space-y-4">
              @if (galleryCategories.length > 1) {
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    (click)="selectedCategory = 'ALL'; activeImageIndex = 0"
                    [class]="'px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ' + (selectedCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')"
                  >
                    Semua Foto ({{ property()!.images.length }})
                  </button>
                  @for (cat of galleryCategories; track cat) {
                    <button
                      type="button"
                      (click)="selectedCategory = cat; activeImageIndex = 0"
                      [class]="'px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ' + (selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')"
                    >
                      {{ cat }} ({{ getCatCount(cat) }})
                    </button>
                  }
                </div>
              }

              <!-- Main Display -->
              <div class="relative h-[340px] sm:h-[460px] w-full rounded-2xl overflow-hidden bg-slate-950 group shadow-md">
                <img
                  [src]="currentGalleryImage.url"
                  [alt]="currentGalleryImage.alt"
                  class="w-full h-full object-cover transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                  (error)="onImgError($event)"
                />
                <div class="absolute top-4 left-4 z-10">
                  <span class="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">{{ currentGalleryImage.category }}</span>
                </div>
                <button
                  type="button"
                  (click)="isViewerOpen = true"
                  class="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md backdrop-blur-xs transition-transform active:scale-95"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                  <span class="hidden sm:inline">Layar Penuh</span>
                </button>

                @if (filteredGalleryImages.length > 1) {
                  <button type="button" (click)="prevImage()" class="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button type="button" (click)="nextImage()" class="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                }

                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs z-10 drop-shadow-md">
                  <p class="font-medium bg-black/40 px-3 py-1 rounded-lg backdrop-blur-xs max-w-[80%] truncate">{{ currentGalleryImage.alt }}</p>
                  <span class="bg-black/60 px-2.5 py-1 rounded-lg font-bold">{{ activeImageIndex + 1 }} / {{ filteredGalleryImages.length }}</span>
                </div>
              </div>

              <!-- Thumbnails -->
              @if (filteredGalleryImages.length > 1) {
                <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                  @for (img of filteredGalleryImages; track img.id; let idx = $index) {
                    <button
                      type="button"
                      (click)="activeImageIndex = idx"
                      [class]="'relative h-18 sm:h-22 rounded-xl overflow-hidden border-2 transition-all ' + (activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-transparent opacity-70 hover:opacity-100')"
                    >
                      <img [src]="img.url" [alt]="img.alt" class="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                    </button>
                  }
                </div>
              }
            </section>

            <!-- 3. Specifications -->
            <section class="space-y-4">
              <h2 class="text-xl font-bold text-slate-900">Spesifikasi Properti</h2>
              <dl class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                @for (spec of specificationList; track spec.label) {
                  <div class="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
                    <div class="flex items-center gap-2 text-slate-400">
                      <span class="text-blue-600" [innerHTML]="spec.svg"></span>
                      <dt class="text-[11px] font-medium text-slate-500 truncate">{{ spec.label }}</dt>
                    </div>
                    <dd class="text-sm font-bold text-slate-900 truncate">{{ spec.value }}</dd>
                  </div>
                }
              </dl>
            </section>

            <!-- 4. Description -->
            <section class="space-y-3">
              <h2 class="text-xl font-bold text-slate-900">Deskripsi &amp; Keunggulan Hunian</h2>
              <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs leading-relaxed text-slate-700 space-y-4 text-sm sm:text-base">
                <p>{{ property()!.description }}</p>
                <div class="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                    Tahun Dibangun: {{ property()!.yearBuilt || 2024 }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Kondisi Unit: Baru Siap Huni
                  </span>
                </div>
              </div>
            </section>

            <!-- 5. Facilities -->
            @if (property()!.facilities && property()!.facilities.length > 0) {
              <section class="space-y-4">
                <h2 class="text-xl font-bold text-slate-900">Fasilitas &amp; Fitur Lingkungan</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  @for (fac of property()!.facilities; track fac.id) {
                    <div class="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
                      <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-slate-900">{{ fac.name }}</p>
                        @if (fac.category) {
                          <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{{ fac.category }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </section>
            }

            <!-- 6. Floor Plans -->
            @if (property()!.floorPlans && property()!.floorPlans.length > 0) {
              <section class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                      <span>Denah &amp; Tata Ruang Arsitektur</span>
                    </h2>
                    <p class="text-xs text-slate-500 mt-0.5">Eksplorasi blueprint 2D terukur, tata letak ruang, dan dimensi presisi setiap ruangan</p>
                  </div>
                  @if (property()!.floorPlans.length > 1) {
                    <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-full w-fit shrink-0">
                      @for (plan of property()!.floorPlans; track plan.id; let idx = $index) {
                        <button
                          type="button"
                          (click)="activeFloorIndex = idx; zoomLevel = 1"
                          [class]="'px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ' + (activeFloorIndex === idx ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900')"
                        >
                          <span>Lantai {{ plan.floor }}</span>
                          <span class="text-[10px] font-normal opacity-80">({{ plan.area }} m²)</span>
                        </button>
                      }
                    </div>
                  }
                </div>

                <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                  <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm sm:text-base font-extrabold text-slate-900">{{ currentFloorPlan.name }}</span>
                        <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">Lantai {{ currentFloorPlan.floor }}</span>
                      </div>
                      @if (currentFloorPlan.note) {
                        <p class="text-xs text-slate-600 mt-1">{{ currentFloorPlan.note }}</p>
                      }
                    </div>
                    <div class="flex items-center gap-3 text-xs font-semibold text-slate-700 shrink-0">
                      <div class="px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">Luas: {{ currentFloorPlan.area }} m²</div>
                      @if (currentFloorPlan.bedrooms) { <div class="px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">{{ currentFloorPlan.bedrooms }} Kamar</div> }
                      @if (currentFloorPlan.bathrooms) { <div class="px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">{{ currentFloorPlan.bathrooms }} KM</div> }
                    </div>
                  </div>

                  <div class="p-4 sm:p-5 space-y-4">
                    <div class="relative h-[320px] sm:h-[420px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center select-none group">
                      <div class="w-full h-full flex items-center justify-center p-4 transition-transform duration-200 ease-out" [style.transform]="'scale(' + zoomLevel + ')'">
                        <img [src]="currentFloorPlan.url" [alt]="currentFloorPlan.name" class="max-w-full max-h-full object-contain filter drop-shadow-2xl" loading="lazy" referrerpolicy="no-referrer" />
                      </div>
                      <div class="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-bold border border-slate-700/60">Zoom: {{ (zoomLevel * 100).toFixed(0) }}%</div>
                      <div class="absolute top-3 right-3 flex gap-1 z-10">
                        <button type="button" (click)="zoomIn()" class="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-blue-600 text-xs font-bold">+</button>
                        <button type="button" (click)="zoomOut()" class="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-blue-600 text-xs font-bold">-</button>
                        <button type="button" (click)="zoomLevel = 1" class="px-2 py-1 rounded-full bg-slate-900/80 text-white hover:bg-blue-600 text-[10px] font-bold">1x</button>
                      </div>
                    </div>

                    @if (currentFloorPlan.rooms && currentFloorPlan.rooms.length > 0) {
                      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-2">
                        @for (room of currentFloorPlan.rooms; track room.name) {
                          <div class="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-left">
                            <span class="text-xs font-bold text-slate-900 block truncate">{{ room.name }}</span>
                            <div class="flex items-center justify-between text-[11px] text-slate-600 font-semibold mt-1">
                              <span class="text-slate-500">{{ room.dimension }}</span>
                              <span class="text-blue-700 font-bold">{{ room.area }} m²</span>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              </section>
            }

            <!-- 7. Location -->
            <section class="space-y-4">
              <h2 class="text-xl font-bold text-slate-900">Lokasi &amp; Aksesibilitas Sekitar</h2>
              <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <p class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {{ property()!.location.address }}
                    </p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ property()!.location.district ? property()!.location.district + ', ' : '' }}{{ property()!.location.city }}, {{ property()!.location.province }}</p>
                  </div>
                  <div class="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                    Koordinat: {{ property()!.location.latitude.toFixed(4) }}, {{ property()!.location.longitude.toFixed(4) }}
                  </div>
                </div>

                <div class="relative h-64 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center p-6">
                  <div class="relative z-10 space-y-2">
                    <div class="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-blue-400/30">
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <h4 class="text-white font-bold text-sm">Peta Kawasan {{ property()!.location.city }}</h4>
                    <p class="text-xs text-slate-300 max-w-sm">Lokasi strategis berada di titik koordinat ({{ property()!.location.latitude }}, {{ property()!.location.longitude }})</p>
                  </div>
                </div>

                @if (property()!.location.nearbyPlaces && property()!.location.nearbyPlaces!.length > 0) {
                  <div>
                    <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Fasilitas &amp; Tempat Penting Terdekat:</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      @for (place of property()!.location.nearbyPlaces!; track place.name) {
                        <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                          <div class="w-8 h-8 rounded-lg bg-white shadow-xs text-blue-600 flex items-center justify-center shrink-0">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          </div>
                          <div class="truncate">
                            <p class="text-xs font-bold text-slate-900 truncate">{{ place.name }}</p>
                            <p class="text-[11px] text-blue-600 font-semibold">{{ place.distance }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </section>
          </article>

          <!-- Aside: Decision Panel -->
          <div class="lg:col-span-1">
            <aside class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-lg space-y-6 sticky top-20">
              <div class="space-y-1 pb-5 border-b border-slate-100">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Harga Penawaran Resmi</span>
                <div class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{{ property()!.price | rupiah }}</div>
                <div class="pt-2 flex items-center justify-between bg-blue-50/80 px-3.5 py-2 rounded-full border border-blue-100">
                  <div>
                    <span class="text-[10px] font-medium text-slate-600 block">Estimasi Cicilan KPR</span>
                    <span class="text-xs font-extrabold text-blue-700">~{{ estimatedMonthlyKpr | rupiah:true }} / bulan</span>
                  </div>
                  <button type="button" (click)="navigate('/simulator/kpr?price=' + property()!.price)" class="text-[11px] font-bold text-blue-700 underline hover:text-blue-800">Simulasikan</button>
                </div>
              </div>

              <div class="space-y-2.5">
                <button
                  type="button"
                  (click)="navigate('/simulator/kpr?price=' + property()!.price)"
                  class="w-full inline-flex items-center justify-center gap-2 font-bold shadow-md text-base px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  Hitung Simulasi KPR
                </button>

                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    (click)="onToggleCompare()"
                    [class]="'inline-flex items-center justify-center gap-2 font-semibold text-sm px-4 py-2 rounded-full border transition-all active:scale-[0.98] ' + (isCompared ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-xs')"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                    <span>{{ isCompared ? 'Di Komparasi' : 'Bandingkan' }}</span>
                  </button>

                  <button
                    type="button"
                    (click)="onToggleFavorite()"
                    [class]="'inline-flex items-center justify-center gap-2 font-semibold text-sm px-4 py-2 rounded-full border transition-all active:scale-[0.98] ' + (isFavorite ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-xs')"
                  >
                    <svg [class]="'w-4 h-4 ' + (isFavorite ? 'fill-current' : '')" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    <span>{{ isFavorite ? 'Tersimpan' : 'Favorit' }}</span>
                  </button>
                </div>
              </div>

              @if (property()!.partner) {
                <div class="pt-4 border-t border-slate-100 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Developer / Pengembang</span>
                    @if (property()!.partner!.verified) {
                      <span class="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        Terverifikasi
                      </span>
                    }
                  </div>

                  <div class="flex items-center gap-3">
                    <img [src]="property()!.partner!.logo" [alt]="property()!.partner!.name" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" referrerpolicy="no-referrer" />
                    <div>
                      <h3 class="text-sm font-bold text-slate-900 leading-tight">{{ property()!.partner!.name }}</h3>
                      <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">{{ property()!.partner!.description }}</p>
                    </div>
                  </div>

                  <div class="space-y-2 pt-1 text-xs">
                    @if (property()!.partner!.phone) {
                      <div class="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <svg class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span class="font-semibold">{{ property()!.partner!.phone }}</span>
                      </div>
                    }
                    @if (property()!.partner!.email) {
                      <div class="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <svg class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span class="font-semibold truncate">{{ property()!.partner!.email }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-1.5 text-[11px] text-slate-600">
                <div class="flex items-center gap-1.5 font-bold text-slate-800">
                  <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Jaminan Informasi Legalitas</span>
                </div>
                <p class="leading-relaxed">Semua dokumen kepemilikan, sertifikat (SHM/PPJB), dan izin konstruksi telah diverifikasi oleh tim legal platform.</p>
              </div>
            </aside>
          </div>
        </div>

        <!-- Similar Properties -->
        @if (similarProperties().length > 0) {
          <section class="pt-12 border-t border-slate-200 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-slate-900">Properti Serupa di {{ property()!.location.city }}</h2>
                <p class="text-xs text-slate-500 mt-0.5">Pilihan alternatif dengan tipe dan rentang harga yang sebanding</p>
              </div>
              <button
                type="button"
                (click)="navigate('/buy?city=' + property()!.location.city)"
                class="px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 text-xs font-semibold shadow-xs"
              >
                Lihat Semua
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (simProp of similarProperties(); track simProp.id) {
                <app-property-card
                  [property]="simProp"
                  [isFavorite]="favSvc.isFavorite(simProp.id)"
                  [isCompared]="compSvc.isInComparison(simProp.id)"
                  (toggleFavorite)="favSvc.toggle($event)"
                  (toggleCompare)="compSvc.toggle($event)"
                />
              }
            </div>
          </section>
        }
      </main>
    }
  `,
})
export class PropertyDetailPageComponent implements OnInit {
  @Input() slug = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly favSvc = inject(FavoriteService);
  readonly compSvc = inject(ComparisonService);
  private notifSvc = inject(NotificationService);

  property = signal<Property | null>(null);
  similarProperties = signal<Property[]>([]);
  loading = signal(true);

  selectedCategory: ImageCategory | 'ALL' = 'ALL';
  activeImageIndex = 0;
  isViewerOpen = false;
  activeFloorIndex = 0;
  zoomLevel = 1;

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async (params) => {
      const s = params.get('slug') || this.slug;
      if (s) {
        await this.loadProperty(s);
      }
    });
  }

  async loadProperty(slugStr: string): Promise<void> {
    this.loading.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const prop = await propertyRepository.getPropertyBySlug(slugStr);
      this.property.set(prop || null);
      if (prop) {
        const similar = await propertyRepository.getSimilarProperties(prop, 3);
        this.similarProperties.set(similar);
      }
    } catch (err) {
      console.error('Failed to load property', err);
    } finally {
      this.loading.set(false);
    }
  }

  get galleryCategories(): ImageCategory[] {
    const p = this.property();
    if (!p || !p.images) return [];
    return Array.from(new Set(p.images.map((img) => img.category)));
  }

  getCatCount(cat: ImageCategory): number {
    return (this.property()?.images || []).filter((i) => i.category === cat).length;
  }

  get filteredGalleryImages(): PropertyImage[] {
    const p = this.property();
    if (!p || !p.images) return [];
    return this.selectedCategory === 'ALL'
      ? p.images
      : p.images.filter((img) => img.category === this.selectedCategory);
  }

  get currentGalleryImage(): PropertyImage {
    return this.filteredGalleryImages[this.activeImageIndex] || this.filteredGalleryImages[0] || {
      id: 'placeholder',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Foto Properti',
      category: 'FACADE' as ImageCategory,
    };
  }

  get currentFloorPlan(): FloorPlan {
    const p = this.property();
    return p?.floorPlans?.[this.activeFloorIndex] || p?.floorPlans?.[0] || {
      id: 'default',
      name: 'Denah Lantai 1',
      floor: 1,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      area: 100,
    };
  }

  get estimatedMonthlyKpr(): number {
    const p = this.property();
    if (!p) return 0;
    const loanPrincipal = p.price * 0.8;
    const monthlyRate = 0.055 / 12;
    return Math.round((loanPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -240)));
  }

  get isFavorite(): boolean {
    const p = this.property();
    return p ? this.favSvc.isFavorite(p.id) : false;
  }

  get isCompared(): boolean {
    const p = this.property();
    return p ? this.compSvc.isInComparison(p.id) : false;
  }

  get specificationList() {
    const s = this.property()?.specification;
    if (!s) return [];
    return [
      { label: 'Kamar Tidur', value: `${s.bedrooms} Kamar`, svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
      { label: 'Kamar Mandi', value: `${s.bathrooms} Kamar Mandi`, svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>' },
      { label: 'Luas Bangunan', value: `${s.buildingArea} m²`, svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
      { label: 'Luas Tanah', value: `${s.landArea} m²`, svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>' },
      { label: 'Jumlah Lantai', value: `${s.floors} Lantai`, svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>' },
      { label: 'Parkir / Carport', value: `${s.parking} Mobil`, svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>' },
      { label: 'Legalitas', value: s.certificate || 'SHM Murni', svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
      { label: 'Daya Listrik', value: s.electricity || '2200 VA', svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
      { label: 'Kondisi Perabotan', value: s.furnishing === 'FULL_FURNISHED' ? 'Full Furnished' : s.furnishing === 'SEMI_FURNISHED' ? 'Semi Furnished' : 'Unfurnished', svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
      { label: 'Arah Hadap', value: s.facing === 'NORTH' ? 'Utara' : s.facing === 'SOUTH' ? 'Selatan' : s.facing === 'EAST' ? 'Timur' : 'Barat', svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
    ];
  }

  nextImage(): void {
    this.activeImageIndex = (this.activeImageIndex + 1) % this.filteredGalleryImages.length;
  }

  prevImage(): void {
    this.activeImageIndex = (this.activeImageIndex - 1 + this.filteredGalleryImages.length) % this.filteredGalleryImages.length;
  }

  zoomIn(): void { this.zoomLevel = Math.min(this.zoomLevel + 0.25, 2.5); }
  zoomOut(): void { this.zoomLevel = Math.max(this.zoomLevel - 0.25, 0.75); }

  onToggleFavorite(): void {
    const p = this.property();
    if (!p) return;
    const added = this.favSvc.toggle(p.id);
    this.notifSvc.show(added ? 'Properti berhasil disimpan ke favorit' : 'Properti dihapus dari daftar favorit', 'success');
  }

  onToggleCompare(): void {
    const p = this.property();
    if (!p) return;
    const result = this.compSvc.toggle(p.id);
    this.notifSvc.show(result.message, result.isInComparison ? 'success' : 'info');
  }

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

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  }
}
