import React, { useEffect, useState } from 'react';
import { Property } from '../../../core/types/property.types';
import { propertyRepository } from '../../../core/repositories/property.repository';
import { PropertyGallery } from '../components/PropertyGallery';
import { PropertyHeader } from '../components/PropertyHeader';
import { PropertySpecifications } from '../components/PropertySpecifications';
import { PropertyFacilities } from '../components/PropertyFacilities';
import { PropertyFloorPlan } from '../components/PropertyFloorPlan';
import { PropertyLocation } from '../components/PropertyLocation';
import { PropertyDecisionPanel } from '../components/PropertyDecisionPanel';
import { PropertyCard } from '../../discovery/components/PropertyCard';
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';

interface PropertyDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparisonList: string[];
  onToggleCompare: (id: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  slug,
  onNavigate,
  favorites,
  onToggleFavorite,
  comparisonList,
  onToggleCompare,
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    propertyRepository
      .getPropertyBySlug(slug)
      .then(async (prop) => {
        if (isMounted) {
          setProperty(prop);
          if (prop) {
            const similar = await propertyRepository.getSimilarProperties(prop, 3);
            if (isMounted) setSimilarProperties(similar);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load property by slug:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-10 w-3/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Properti Tidak Ditemukan"
          description="Properti yang Anda cari mungkin sudah tidak tersedia atau tautan yang Anda gunakan tidak valid."
          actionText="Kembali ke Katalog Properti"
          onAction={() => onNavigate('/buy')}
        />
      </main>
    );
  }

  const isFav = favorites.includes(property.id);
  const isComp = comparisonList.includes(property.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Jelajah Properti', path: '/buy' },
          { label: property.location.city, path: `/buy?city=${property.location.city}` },
          { label: property.title },
        ]}
        onNavigate={onNavigate}
      />

      {/* Main Structural Grid (Semantic Article on Left, Decision Aside on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Article: Comprehensive Property Evaluation Content */}
        <article className="lg:col-span-2 space-y-10">
          {/* 1. Header Identity */}
          <PropertyHeader property={property} />

          {/* 2. Gallery Section */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* 3. Specifications */}
          <PropertySpecifications specification={property.specification} />

          {/* 4. Description Section */}
          <section aria-labelledby="overview-heading" className="space-y-3">
            <h2 id="overview-heading" className="text-xl font-bold text-slate-900">
              Deskripsi & Keunggulan Hunian
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs leading-relaxed text-slate-700 space-y-4 text-sm sm:text-base">
              <p>{property.description}</p>
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Tahun Dibangun: {property.yearBuilt || 2024}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Kondisi Unit: Baru Siap Huni
                </span>
              </div>
            </div>
          </section>

          {/* 5. Facilities Grid */}
          <PropertyFacilities facilities={property.facilities} />

          {/* 6. Floor Plans */}
          <PropertyFloorPlan floorPlans={property.floorPlans} />

          {/* 7. Location & Accessibility */}
          <PropertyLocation location={property.location} />
        </article>

        {/* Aside: Sticky Decision Actions Panel */}
        <div className="lg:col-span-1">
          <PropertyDecisionPanel
            property={property}
            isFavorite={isFav}
            onToggleFavorite={() => onToggleFavorite(property.id)}
            isCompared={isComp}
            onToggleCompare={() => onToggleCompare(property.id)}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Similar Properties Recommendation Section */}
      {similarProperties.length > 0 && (
        <section aria-labelledby="similar-heading" className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="similar-heading" className="text-xl font-bold text-slate-900">
                Properti Serupa di {property.location.city}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilihan alternatif dengan tipe dan rentang harga yang sebanding
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(`/buy?city=${property.location.city}`)}
            >
              Lihat Semua
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((simProp) => (
              <PropertyCard
                key={simProp.id}
                property={simProp}
                onNavigate={onNavigate}
                isFavorite={favorites.includes(simProp.id)}
                onToggleFavorite={onToggleFavorite}
                isCompared={comparisonList.includes(simProp.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
