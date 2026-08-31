import React from 'react';
import { PropertySortOption } from '../../../core/types/property.types';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';

interface PropertySortHeaderProps {
  totalResults: number;
  currentSort: PropertySortOption;
  onSortChange: (sort: PropertySortOption) => void;
  onOpenMobileFilter: () => void;
  activeFilterCount: number;
}

export const PropertySortHeader: React.FC<PropertySortHeaderProps> = ({
  totalResults,
  currentSort,
  onSortChange,
  onOpenMobileFilter,
  activeFilterCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:px-5 sm:py-3.5 rounded-full border border-slate-200/80 shadow-xs mb-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-700">
          Menampilkan <span className="font-bold text-slate-900">{totalResults}</span> properti siap huni
        </p>

        {/* Mobile Filter Button (Capsule) */}
        <button
          type="button"
          onClick={onOpenMobileFilter}
          className="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="property-sort-select" className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Urutkan:</span>
        </label>
        <select
          id="property-sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as PropertySortOption)}
          className="text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-200 rounded-full px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
        >
          <option value="relevance">Rekomendasi & Unggulan</option>
          <option value="price_asc">Harga Terendah ke Tertinggi</option>
          <option value="price_desc">Harga Tertinggi ke Terendah</option>
          <option value="newest">Listing Terbaru</option>
          <option value="land_area_desc">Luas Tanah Terbesar</option>
          <option value="building_area_desc">Luas Bangunan Terbesar</option>
        </select>
      </div>
    </div>
  );
};
