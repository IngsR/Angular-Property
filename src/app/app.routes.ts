import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/home/pages/home.component').then((m) => m.HomePageComponent),
    title: 'Beranda - Platform Pencarian & Keputusan Properti',
  },
  {
    path: 'buy',
    loadComponent: () =>
      import('@features/discovery/pages/discovery.component').then(
        (m) => m.PropertyDiscoveryPageComponent,
      ),
    title: 'Jelajah Properti - Temukan Rumah & Properti Pilihan',
  },
  {
    path: 'property/:slug',
    loadComponent: () =>
      import('@features/property/pages/property.component').then(
        (m) => m.PropertyDetailPageComponent,
      ),
    title: 'Detail Properti',
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('@features/comparison/pages/comparison.component').then(
        (m) => m.ComparisonPageComponent,
      ),
    title: 'Matriks Komparasi - Bandingkan 2 Properti Pilihan',
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('@features/favorites/pages/favorites.component').then((m) => m.FavoritesPageComponent),
    title: 'Properti Tersimpan - Daftar Favorit Anda',
  },
  {
    path: 'simulator/kpr',
    loadComponent: () =>
      import('@features/simulator/pages/kpr/kpr.component').then(
        (m) => m.KprSimulatorPageComponent,
      ),
    title: 'Simulator KPR - Kalkulator Angsuran & Kelayakan Finansial',
  },
  { path: '**', redirectTo: '' },
];
