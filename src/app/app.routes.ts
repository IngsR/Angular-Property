import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../features/home/pages/home-page').then(m => m.HomePageComponent),
    title: 'Beranda - Platform Pencarian & Keputusan Properti',
  },
  {
    path: 'buy',
    loadComponent: () =>
      import('../features/discovery/pages/property-discovery-page').then(m => m.PropertyDiscoveryPageComponent),
    title: 'Jelajah Properti - Temukan Rumah & Properti Pilihan',
  },
  {
    path: 'property/:slug',
    loadComponent: () =>
      import('../features/property/pages/property-detail-page').then(m => m.PropertyDetailPageComponent),
    title: 'Detail Properti',
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('../features/comparison/pages/comparison-page').then(m => m.ComparisonPageComponent),
    title: 'Matriks Komparasi - Bandingkan 2 Properti Pilihan',
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('../features/favorites/pages/favorites-page').then(m => m.FavoritesPageComponent),
    title: 'Properti Tersimpan - Daftar Favorit Anda',
  },
  {
    path: 'simulator/kpr',
    loadComponent: () =>
      import('../features/simulator/kpr/pages/kpr-simulator-page').then(m => m.KprSimulatorPageComponent),
    title: 'Simulator KPR - Kalkulator Angsuran & Kelayakan Finansial',
  },
  { path: '**', redirectTo: '' },
];
