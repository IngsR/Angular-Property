import React, { useState, useEffect } from 'react';
import { SiteHeader } from '../shared/components/SiteHeader';
import { SiteFooter } from '../shared/components/SiteFooter';
import { HomePage } from '../features/home/pages/HomePage';
import { PropertyDiscoveryPage } from '../features/discovery/pages/PropertyDiscoveryPage';
import { PropertyDetailPage } from '../features/property/pages/PropertyDetailPage';
import { ComparisonPage } from '../features/comparison/pages/ComparisonPage';
import { FavoritesPage } from '../features/favorites/pages/FavoritesPage';
import { KprSimulatorPage } from '../features/simulator/kpr/pages/KprSimulatorPage';
import { PropertyQuery } from '../core/types/property.types';
import {
  favoriteService,
  comparisonService,
  notificationService,
  ToastNotification,
} from '../core/services';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function AppRoot() {
  // Navigation State (equivalent to Angular Router url stream)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });

  // Global Notification State (injected from NotificationService)
  const [notification, setNotification] = useState<ToastNotification | null>(null);

  // Injected State from FavoriteService
  const [favorites, setFavorites] = useState<string[]>(() => favoriteService.getFavorites());

  // Injected State from ComparisonService (max 2 properties)
  const [comparisonList, setComparisonList] = useState<string[]>(() =>
    comparisonService.getComparisonList()
  );

  // Subscriptions to Angular-style Services
  useEffect(() => {
    const unsubFav = favoriteService.subscribe(setFavorites);
    const unsubComp = comparisonService.subscribe(setComparisonList);
    const unsubNotif = notificationService.subscribe(setNotification);

    return () => {
      unsubFav();
      unsubComp();
      unsubNotif();
    };
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Delegated Service Actions
  const handleToggleFavorite = (id: string) => {
    const isAdded = favoriteService.toggle(id);
    notificationService.show(
      isAdded
        ? 'Properti berhasil disimpan ke favorit'
        : 'Properti dihapus dari daftar favorit',
      'success'
    );
  };

  const handleClearFavorites = () => {
    favoriteService.clear();
    notificationService.show('Semua properti favorit telah dibersihkan', 'info');
  };

  const handleToggleCompare = (id: string) => {
    const result = comparisonService.toggle(id);
    notificationService.show(result.message, result.isInComparison ? 'success' : 'info');
  };

  const handleRemoveFromCompare = (id: string) => {
    comparisonService.remove(id);
    notificationService.show('Properti dihapus dari komparasi', 'info');
  };

  const handleClearCompare = () => {
    comparisonService.clear();
    notificationService.show('Daftar komparasi dikosongkan', 'info');
  };

  const handleAddToCompare = (id: string) => {
    const result = comparisonService.add(id);
    notificationService.show(
      result.message || 'Properti ditambahkan ke perbandingan',
      result.success ? 'success' : 'warning'
    );
  };

  // Route Dispatcher (Equivalent to Angular <router-outlet>)
  const renderRoute = () => {
    const url = new URL(currentPath, 'http://localhost');
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // 1. Property Detail Page: /property/:slug
    if (pathname.startsWith('/property/')) {
      const slug = pathname.replace('/property/', '').split('?')[0];
      return (
        <PropertyDetailPage
          slug={slug}
          onNavigate={navigate}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          comparisonList={comparisonList}
          onToggleCompare={handleToggleCompare}
        />
      );
    }

    // 2. Discovery Page: /buy or /buy/:type
    if (pathname.startsWith('/buy')) {
      const initialQuery: PropertyQuery = {};
      if (searchParams.get('search')) initialQuery.search = searchParams.get('search')!;
      if (searchParams.get('city')) initialQuery.city = searchParams.get('city')!;
      if (searchParams.get('propertyType')) initialQuery.propertyType = searchParams.get('propertyType')!;
      if (searchParams.get('minPrice')) initialQuery.minPrice = Number(searchParams.get('minPrice'));
      if (searchParams.get('maxPrice')) initialQuery.maxPrice = Number(searchParams.get('maxPrice'));

      return (
        <PropertyDiscoveryPage
          initialQuery={initialQuery}
          onNavigate={navigate}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          comparisonList={comparisonList}
          onToggleCompare={handleToggleCompare}
        />
      );
    }

    // 3. Comparison Page: /compare
    if (pathname.startsWith('/compare')) {
      return (
        <ComparisonPage
          comparisonList={comparisonList}
          onRemoveFromCompare={handleRemoveFromCompare}
          onClearCompare={handleClearCompare}
          onAddToCompare={handleAddToCompare}
          onNavigate={navigate}
        />
      );
    }

    // 4. Favorites Page: /favorites
    if (pathname.startsWith('/favorites')) {
      return (
        <FavoritesPage
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onClearFavorites={handleClearFavorites}
          comparisonList={comparisonList}
          onToggleCompare={handleToggleCompare}
          onNavigate={navigate}
        />
      );
    }

    // 5. KPR Simulator Page: /simulator/kpr
    if (pathname.startsWith('/simulator/kpr')) {
      const priceParam = searchParams.get('price');
      const initialPrice = priceParam ? Number(priceParam) : undefined;
      return <KprSimulatorPage initialPrice={initialPrice} onNavigate={navigate} />;
    }

    // Default: Home Page
    return (
      <HomePage
        onNavigate={navigate}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        comparisonList={comparisonList}
        onToggleCompare={handleToggleCompare}
      />
    );
  };

  const getNotificationIcon = () => {
    if (!notification) return null;
    switch (notification.type) {
      case 'warning':
      case 'error':
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Global Semantic Header */}
      <SiteHeader
        currentPath={currentPath}
        onNavigate={navigate}
        favoritesCount={favorites.length}
        comparisonCount={comparisonList.length}
      />

      {/* Main Content View */}
      <div className="flex-1">{renderRoute()}</div>

      {/* Global Semantic Footer */}
      <SiteFooter onNavigate={navigate} />

      {/* Global Floating Toast Alert */}
      {notification && (
        <aside
          aria-live="polite"
          className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 text-white rounded-full shadow-2xl border border-slate-700 text-xs font-semibold backdrop-blur-md animate-fade-in"
        >
          {getNotificationIcon()}
          <span>{notification.message}</span>
          <button
            onClick={() => notificationService.dismiss()}
            className="ml-2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </div>
  );
}
