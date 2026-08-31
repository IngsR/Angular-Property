import React from 'react';
import { PropertyQuery, PropertyType, Facility } from '../../../core/types/property.types';
import { RotateCcw, Filter, MapPin, Building, Bed, DollarSign, Sparkles } from 'lucide-react';

interface PropertyFilterSidebarProps {
  query: PropertyQuery;
  onChange: (newQuery: PropertyQuery) => void;
  onReset: () => void;
  cities: string[];
  propertyTypes: PropertyType[];
  facilities: Facility[];
  totalResults: number;
}

export const PropertyFilterSidebar: React.FC<PropertyFilterSidebarProps> = ({
  query,
  onChange,
  onReset,
  cities,
  propertyTypes,
  facilities,
  totalResults,
}) => {
  const handleCityChange = (city: string) => {
    onChange({ ...query, city: city === 'ALL' ? undefined : city, page: 1 });
  };

  const handleTypeChange = (typeId: string) => {
    onChange({ ...query, propertyType: typeId === 'ALL' ? undefined : typeId, page: 1 });
  };

  const handleBedroomsChange = (beds: number | '4+' | undefined) => {
    onChange({ ...query, bedrooms: beds, page: 1 });
  };

  const handleFacilityToggle = (facilityId: string) => {
    const current = query.facilities || [];
    const updated = current.includes(facilityId)
      ? current.filter((id) => id !== facilityId)
      : [...current, facilityId];
    onChange({ ...query, facilities: updated.length > 0 ? updated : undefined, page: 1 });
  };

  const handlePricePreset = (min?: number, max?: number) => {
    onChange({ ...query, minPrice: min, maxPrice: max, page: 1 });
  };

  const activeFilterCount = [
    query.city,
    query.propertyType,
    query.minPrice,
    query.maxPrice,
    query.bedrooms,
    query.bathrooms,
    query.facilities?.length,
  ].filter(Boolean).length;

  return (
    <aside className="w-full bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs divide-y divide-slate-100">
      {/* Header */}
      <div className="pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-blue-50 text-blue-700">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Filter Properti</h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {totalResults} properti ditemukan
            </p>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* 1. Lokasi / Kota */}
      <div className="py-4 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Kota / Wilayah</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleCityChange('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              !query.city || query.city === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Kota
          </button>
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleCityChange(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                query.city?.toLowerCase() === city.toLowerCase()
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tipe Properti */}
      <div className="py-4 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>Tipe Properti</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleTypeChange('ALL')}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold text-center transition-all active:scale-95 ${
              !query.propertyType || query.propertyType === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Tipe
          </button>
          {propertyTypes.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => handleTypeChange(pt.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold text-center truncate transition-all active:scale-95 ${
                query.propertyType === pt.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={pt.name}
            >
              {pt.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Rentang Harga */}
      <div className="py-4 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <DollarSign className="w-3.5 h-3.5 text-blue-600" />
          <span>Budget Harga (IDR)</span>
        </label>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => handlePricePreset(undefined, undefined)}
            className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
              !query.minPrice && !query.maxPrice
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Harga
          </button>
          <button
            type="button"
            onClick={() => handlePricePreset(0, 800000000)}
            className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
              query.maxPrice === 800000000
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Di bawah Rp 800 Juta
          </button>
          <button
            type="button"
            onClick={() => handlePricePreset(800000000, 2000000000)}
            className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
              query.minPrice === 800000000 && query.maxPrice === 2000000000
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Rp 800 Jt - Rp 2 Miliar
          </button>
          <button
            type="button"
            onClick={() => handlePricePreset(2000000000, undefined)}
            className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
              query.minPrice === 2000000000 && !query.maxPrice
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Di atas Rp 2 Miliar
          </button>
        </div>
      </div>

      {/* 4. Kamar Tidur & Kamar Mandi */}
      <div className="py-4 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider mb-2">
            <Bed className="w-3.5 h-3.5 text-blue-600" />
            <span>Kamar Tidur Minimum</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[undefined, 1, 2, 3, '4+'].map((beds, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleBedroomsChange(beds as any)}
                className={`py-1.5 text-xs font-bold rounded-full border transition-all active:scale-95 ${
                  query.bedrooms === beds
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {beds === undefined ? 'Semua' : `${beds}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Fasilitas Pilihan */}
      <div className="py-4 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Fasilitas Utama</span>
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {facilities.map((fac) => {
            const isSelected = query.facilities?.includes(fac.id);
            return (
              <label
                key={fac.id}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-50 cursor-pointer select-none text-xs text-slate-700 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={Boolean(isSelected)}
                  onChange={() => handleFacilityToggle(fac.id)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="truncate">{fac.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
