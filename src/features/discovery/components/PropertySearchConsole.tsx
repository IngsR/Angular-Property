import React, { useState, useEffect, useRef } from 'react';
import { Property, PropertyQuery, PropertyType } from '../../../core/types/property.types';
import { formatRupiah } from '../../../shared/utils/formatters';
import {
  Search,
  X,
  Building2,
  MapPin,
  Home,
  Sparkles,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ShieldCheck,
  Calculator,
  Compass,
} from 'lucide-react';

interface PropertySearchConsoleProps {
  query: PropertyQuery;
  onQueryChange: (newQuery: PropertyQuery) => void;
  onReset: () => void;
  cities: string[];
  propertyTypes: PropertyType[];
  totalResults: number;
  allProperties?: Property[];
  onNavigate?: (path: string) => void;
}

const POPULAR_SEARCHES = [
  { label: 'Kuranji Padang', query: 'Kuranji' },
  { label: 'BSD City', query: 'Freja' },
  { label: 'Cilandak MRT', query: 'Cilandak' },
  { label: 'Dago Bandung', query: 'Dago' },
  { label: 'Canggu Bali', query: 'Canggu' },
  { label: 'Rumah 2 Lantai', query: '2 Lantai' },
];

export const PropertySearchConsole: React.FC<PropertySearchConsoleProps> = ({
  query,
  onQueryChange,
  onReset,
  cities,
  propertyTypes,
  totalResults,
  allProperties = [],
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(query.search || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal searchTerm with query.search when query changes externally
  useEffect(() => {
    setSearchTerm(query.search || '');
  }, [query.search]);

  // Handle click outside to close autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsDropdownOpen(false);
    onQueryChange({
      ...query,
      search: searchTerm.trim() ? searchTerm.trim() : undefined,
      page: 1,
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onQueryChange({
      ...query,
      search: undefined,
      page: 1,
    });
  };

  const handleSelectQuickTag = (tagQuery: string) => {
    setSearchTerm(tagQuery);
    setIsDropdownOpen(false);
    onQueryChange({
      ...query,
      search: tagQuery,
      page: 1,
    });
  };

  const handleCitySelect = (cityName: string | undefined) => {
    onQueryChange({
      ...query,
      city: cityName === 'ALL' || !cityName ? undefined : cityName,
      page: 1,
    });
  };

  const handleTypeSelect = (typeId: string | undefined) => {
    onQueryChange({
      ...query,
      propertyType: typeId === 'ALL' || !typeId ? undefined : typeId,
      page: 1,
    });
  };

  // Filter live suggestions based on searchTerm
  const matchingProperties = searchTerm.trim()
    ? allProperties
        .filter((p) => {
          const term = searchTerm.toLowerCase();
          return (
            p.title.toLowerCase().includes(term) ||
            p.location.city.toLowerCase().includes(term) ||
            (p.location.district && p.location.district.toLowerCase().includes(term)) ||
            p.propertyTypeName.toLowerCase().includes(term) ||
            (p.project?.name && p.project.name.toLowerCase().includes(term))
          );
        })
        .slice(0, 4)
    : [];

  const activeFilters = [
    query.search ? { label: `Kata Kunci: "${query.search}"`, key: 'search' } : null,
    query.city ? { label: `Kota: ${query.city}`, key: 'city' } : null,
    query.propertyType
      ? {
          label: `Tipe: ${propertyTypes.find((t) => t.id === query.propertyType)?.name || query.propertyType}`,
          key: 'propertyType',
        }
      : null,
    query.minPrice || query.maxPrice
      ? {
          label: `Budget: ${
            query.minPrice && query.maxPrice
              ? `${formatRupiah(query.minPrice, true)} - ${formatRupiah(query.maxPrice, true)}`
              : query.minPrice
              ? `> ${formatRupiah(query.minPrice, true)}`
              : `< ${formatRupiah(query.maxPrice!, true)}`
          }`,
          key: 'price',
        }
      : null,
    query.bedrooms ? { label: `${query.bedrooms} KT`, key: 'bedrooms' } : null,
    query.facilities?.length ? { label: `${query.facilities.length} Fasilitas`, key: 'facilities' } : null,
  ].filter(Boolean) as { label: string; key: string }[];

  const removeFilter = (key: string) => {
    switch (key) {
      case 'search':
        setSearchTerm('');
        onQueryChange({ ...query, search: undefined, page: 1 });
        break;
      case 'city':
        onQueryChange({ ...query, city: undefined, page: 1 });
        break;
      case 'propertyType':
        onQueryChange({ ...query, propertyType: undefined, page: 1 });
        break;
      case 'price':
        onQueryChange({ ...query, minPrice: undefined, maxPrice: undefined, page: 1 });
        break;
      case 'bedrooms':
        onQueryChange({ ...query, bedrooms: undefined, page: 1 });
        break;
      case 'facilities':
        onQueryChange({ ...query, facilities: undefined, page: 1 });
        break;
    }
  };

  return (
    <section className="mb-8 space-y-4" ref={containerRef}>
      {/* 1. Balanced Hero Search Console Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-9 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        {/* Glow Ambient Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* 2-Column Responsive Balanced Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading, Main Search Bar & Quick Search Tags (Col 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            {/* Official Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold self-start backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Katalog Resmi Hunian Terverifikasi</span>
            </div>

            {/* Main Title & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Temukan Properti Impian & Analisis KPR Anda
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Filter puluhan pilihan rumah tapak, apartemen, dan villa di Padang, Jabodetabek, Bandung, dan Bali dengan spesifikasi riil dan transparan.
              </p>
            </div>

            {/* Main Search Input Form (Capsule Styled) */}
            <div className="relative pt-1">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-950/80 p-2 rounded-full border border-slate-700/80 shadow-2xl backdrop-blur-md"
              >
                {/* Search Text Input */}
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 absolute left-4 text-blue-400 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    placeholder="Ketik lokasi, perumahan, developer (contoh: Kuranji, BSD, Dago)..."
                    className="w-full pl-11 pr-10 py-3 bg-transparent text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none rounded-full"
                    aria-label="Cari properti"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Hapus pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Submit Search Button (Capsule) */}
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-bold rounded-full transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari Sekarang</span>
                </button>
              </form>

              {/* Autocomplete & Suggestions Dropdown with Protected Boundaries */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/98 text-slate-100 rounded-3xl border border-slate-700/90 shadow-2xl backdrop-blur-xl z-50 p-4 divide-y divide-slate-800 max-h-[340px] overflow-y-auto animate-fade-in">
                  {/* Live Matching Properties */}
                  {matchingProperties.length > 0 && (
                    <div className="pb-3 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Properti Terkait Langsung ({matchingProperties.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchingProperties.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              if (onNavigate) {
                                onNavigate(`/property/${p.slug}`);
                              } else {
                                handleSelectQuickTag(p.title);
                              }
                            }}
                            className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-800/60 hover:bg-blue-950/60 border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer group"
                          >
                            <img
                              src={p.images?.[0]?.url || ''}
                              alt={p.title}
                              className="w-11 h-11 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                                {p.title}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {p.location.city} · {formatRupiah(p.price, true)}
                              </p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches Dropdown List */}
                  <div className="pt-3 pb-1 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kata Kunci Populer</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SEARCHES.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectQuickTag(item.query)}
                          className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-medium text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                        >
                          <Search className="w-3 h-3 text-slate-400" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Popular Search Quick Tags Row (Capsule Shape) */}
            <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider shrink-0 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Pencarian Cepat:</span>
              </span>
              <div className="flex flex-wrap gap-1.5 items-center">
                {POPULAR_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuickTag(item.query)}
                    className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-all whitespace-nowrap active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Interactive Filter & Assurance Card (Col 5 - Balances Layout) */}
          <div className="lg:col-span-5 bg-slate-800/60 border border-slate-700/70 rounded-3xl p-5 sm:p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Filter Instan & Lokasi
                </span>
              </div>
              <span className="text-[11px] font-bold text-blue-300 bg-blue-900/60 px-3 py-0.5 rounded-full border border-blue-700/50">
                {totalResults} Unit
              </span>
            </div>

            {/* Quick City Selector Buttons Grid (Capsule Shaped) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  <span>Pilih Kota Utama</span>
                </span>
                {query.city && (
                  <button
                    type="button"
                    onClick={() => handleCitySelect('ALL')}
                    className="text-blue-400 hover:underline lowercase text-[10px] font-semibold"
                  >
                    reset kota
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCitySelect('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all text-center truncate active:scale-95 ${
                    !query.city
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  Semua
                </button>
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all text-center truncate active:scale-95 ${
                      query.city === city
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                    }`}
                    title={city}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Property Type Selector (Capsule Shaped) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Home className="w-3 h-3 text-indigo-400" />
                  <span>Tipe Properti</span>
                </span>
                {query.propertyType && (
                  <button
                    type="button"
                    onClick={() => handleTypeSelect('ALL')}
                    className="text-indigo-400 hover:underline lowercase text-[10px] font-semibold"
                  >
                    reset tipe
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTypeSelect('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all text-center truncate active:scale-95 ${
                    !query.propertyType
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  Semua Tipe
                </button>
                {propertyTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTypeSelect(t.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all text-center truncate active:scale-95 ${
                      query.propertyType === t.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                    }`}
                    title={t.name}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Transparency Trust Badges (Capsule Container) */}
            <div className="pt-2 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1.5 rounded-full border border-slate-700/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">100% SHM & IMB</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1.5 rounded-full border border-slate-700/40">
                <Calculator className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">Simulasi KPR All-in</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Active Filter Chips & Feedback Bar (Capsule Styled Chips) */}
      {activeFilters.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Filter Aktif ({activeFilters.length}):</span>
            </span>

            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-slate-800 border border-slate-300/80 shadow-2xs font-semibold"
              >
                <span>{f.label}</span>
                <button
                  type="button"
                  onClick={() => removeFilter(f.key)}
                  className="p-0.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                  aria-label={`Hapus filter ${f.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <span className="text-[11px] text-slate-600 font-semibold">
              Ditemukan: <strong>{totalResults}</strong> properti
            </span>
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1 rounded-full transition-colors"
            >
              Reset Semua
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
