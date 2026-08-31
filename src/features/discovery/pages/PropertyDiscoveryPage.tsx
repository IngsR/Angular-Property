import React, { useEffect, useState } from 'react';
import {
  Property,
  PropertyQuery,
  PropertySortOption,
  PropertyType,
  Facility,
} from '../../../core/types/property.types';
import { propertyRepository } from '../../../core/repositories/property.repository';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilterSidebar } from '../components/PropertyFilterSidebar';
import { PropertySortHeader } from '../components/PropertySortHeader';
import { PropertySearchConsole } from '../components/PropertySearchConsole';
import { PropertyCardSkeleton } from '../../../shared/ui/Skeleton';
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs';
import { Modal } from '../../../shared/ui/Modal';
import { Calculator, ShieldCheck, SearchX, RotateCcw, Sparkles, MapPin } from 'lucide-react';

interface PropertyDiscoveryPageProps {
  initialQuery?: PropertyQuery;
  onNavigate: (path: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparisonList: string[];
  onToggleCompare: (id: string) => void;
}

export const PropertyDiscoveryPage: React.FC<PropertyDiscoveryPageProps> = ({
  initialQuery,
  onNavigate,
  favorites,
  onToggleFavorite,
  comparisonList,
  onToggleCompare,
}) => {
  const [query, setQuery] = useState<PropertyQuery>(() => ({
    sort: 'relevance',
    ...(initialQuery || {}),
  }));
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load filter metadata & all properties once for autocomplete
  useEffect(() => {
    async function loadMeta() {
      const [citiesData, typesData, facsData, allPropsRes] = await Promise.all([
        propertyRepository.getCities(),
        propertyRepository.getPropertyTypes(),
        propertyRepository.getFacilities(),
        propertyRepository.getProperties({ limit: 50 }),
      ]);
      setCities(citiesData);
      setPropertyTypes(typesData);
      setFacilities(facsData);
      setAllProperties(allPropsRes.properties);
    }
    loadMeta();
  }, []);

  // Fetch properties on query change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    propertyRepository
      .getProperties(query)
      .then((res) => {
        if (isMounted) {
          setProperties(res.properties);
          setTotal(res.total);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load properties', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  const handleResetFilters = () => {
    setQuery({
      sort: 'relevance',
      page: 1,
    });
    setMobileFilterOpen(false);
  };

  const handleQuickCitySelect = (city: string) => {
    setQuery({
      sort: 'relevance',
      city,
      page: 1,
    });
  };

  const activeFilterCount = [
    query.city,
    query.propertyType,
    query.minPrice,
    query.maxPrice,
    query.bedrooms,
    query.bathrooms,
    query.facilities?.length,
    query.search,
  ].filter(Boolean).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Jelajah Properti', path: '/buy' },
          ...(query.city ? [{ label: `Kota ${query.city}` }] : []),
          ...(query.propertyType
            ? [
                {
                  label:
                    propertyTypes.find((t) => t.id === query.propertyType)?.name ||
                    'Tipe Properti',
                },
              ]
            : []),
        ]}
        onNavigate={onNavigate}
      />

      {/* Upgraded Intuitive Search Console & Filter Bar */}
      <PropertySearchConsole
        query={query}
        onQueryChange={(newQ) => setQuery(newQ)}
        onReset={handleResetFilters}
        cities={cities}
        propertyTypes={propertyTypes}
        totalResults={total}
        allProperties={allProperties}
        onNavigate={onNavigate}
      />

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <PropertyFilterSidebar
            query={query}
            onChange={(newQ) => setQuery(newQ)}
            onReset={handleResetFilters}
            cities={cities}
            propertyTypes={propertyTypes}
            facilities={facilities}
            totalResults={total}
          />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3">
          <PropertySortHeader
            totalResults={total}
            currentSort={query.sort || 'relevance'}
            onSortChange={(newSort: PropertySortOption) =>
              setQuery((prev) => ({ ...prev, sort: newSort, page: 1 }))
            }
            onOpenMobileFilter={() => setMobileFilterOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {/* KPR & Price Calculation Transparency Banner */}
          <div className="mb-6 p-4 rounded-3xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <div className="p-2.5 rounded-full bg-blue-600 text-white shrink-0 shadow-2xs mt-0.5">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  Transparansi Harga & Estimasi Cicilan KPR
                </p>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Semua harga adalah harga resmi pengembang (Tunai / KPR). Estimasi cicilan per bulan dihitung berdasarkan <strong>DP 20%</strong>, bunga efektif <strong>5.5% p.a.</strong>, dan tenor <strong>20 tahun (240 bulan)</strong>.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-white px-3.5 py-1.5 rounded-full border border-blue-200 shadow-2xs self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Sertifikat Terjamin</span>
            </div>
          </div>

          {/* Results State Handling */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                <SearchX className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">
                  Tidak Ditemukan Properti yang Cocok
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Kami tidak menemukan properti yang sesuai dengan filter atau kata kunci{' '}
                  {query.search ? <strong>"{query.search}"</strong> : 'saat ini'}.
                </p>
              </div>

              {/* Helpful Quick Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Semua Filter & Pencarian</span>
                </button>
              </div>

              {/* Suggestions Chips */}
              <div className="pt-4 border-t border-slate-100 max-w-lg mx-auto">
                <p className="text-xs text-slate-400 font-medium mb-2.5 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Coba jelajahi kota populer berikut:</span>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {cities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleQuickCitySelect(c)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200/80 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <section aria-label="Daftar Properti" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onNavigate={onNavigate}
                  isFavorite={favorites.includes(property.id)}
                  onToggleFavorite={onToggleFavorite}
                  isCompared={comparisonList.includes(property.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Pencarian Properti"
      >
        <PropertyFilterSidebar
          query={query}
          onChange={(newQ) => {
            setQuery(newQ);
            setMobileFilterOpen(false);
          }}
          onReset={handleResetFilters}
          cities={cities}
          propertyTypes={propertyTypes}
          facilities={facilities}
          totalResults={total}
        />
      </Modal>
    </main>
  );
};
