import { NavRoute } from '../core/models/navigation.model';
import { Home, Compass, Scale, Bookmark, Calculator } from 'lucide-react';

/**
 * Route definitions (aligned with Angular AppRoutingModule structure)
 */
export const APP_ROUTES: NavRoute[] = [
  {
    path: '/',
    title: 'Beranda - Platform Pencarian & Keputusan Properti',
    label: 'Beranda',
    icon: Home,
    exact: true,
  },
  {
    path: '/buy',
    title: 'Jelajah Properti - Temukan Rumah & Properti Pilihan',
    label: 'Jelajah',
    icon: Compass,
  },
  {
    path: '/compare',
    title: 'Matriks Komparasi - Bandingkan 2 Properti Pilihan',
    label: 'Bandingkan',
    icon: Scale,
  },
  {
    path: '/favorites',
    title: 'Properti Tersimpan - Daftar Favorit Anda',
    label: 'Favorit',
    icon: Bookmark,
  },
  {
    path: '/simulator/kpr',
    title: 'Simulator KPR - Kalkulator Angsuran & Kelayakan Finansial',
    label: 'Simulator KPR',
    icon: Calculator,
  },
];
