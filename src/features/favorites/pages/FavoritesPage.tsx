import React, { useEffect, useState } from 'react';
import { Property } from '../../../core/types/property.types';
import { propertyRepository } from '../../../core/repositories/property.repository';
import { PropertyCard } from '../../discovery/components/PropertyCard';
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Button } from '../../../shared/ui/Button';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { Bookmark, Trash2, Scale } from 'lucide-react';

interface FavoritesPageProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onClearFavorites: () => void;
  comparisonList: string[];
  onToggleCompare: (id: string) => void;
  onNavigate: (path: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  onToggleFavorite,
  onClearFavorites,
  comparisonList,
  onToggleCompare,
  onNavigate,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    propertyRepository
      .getPropertiesByIds(favorites)
      .then((data) => {
        if (isMounted) {
          setProperties(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load favorites', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [favorites]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Properti Tersimpan (Favorit)' }]} onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Properti Tersimpan ({favorites.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Daftar listing hunian yang Anda simpan untuk dievaluasi lebih lanjut.
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Scale className="w-4 h-4" />}
              onClick={() => onNavigate('/compare')}
            >
              Buka Komparasi
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
              onClick={onClearFavorites}
              className="text-rose-600 hover:bg-rose-50"
            >
              Hapus Semua
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : properties.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Belum Ada Properti yang Disimpan"
            description="Simpan listing yang menarik perhatian Anda dengan menekan ikon hati pada kartu properti untuk memudahkan perbandingan di kemudian waktu."
            actionText="Jelajahi Properti Pilihan"
            onAction={() => onNavigate('/buy')}
            customIcon={<Bookmark className="w-8 h-8 text-rose-500" />}
          />
        </div>
      ) : (
        <section aria-label="Daftar Favorit" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onNavigate={onNavigate}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              isCompared={comparisonList.includes(property.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </section>
      )}
    </main>
  );
};
