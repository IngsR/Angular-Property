import React from 'react';
import { Property } from '../../../core/types/property.types';
import { formatRupiah } from '../../../shared/utils/formatters';
import {
  Bed,
  Bath,
  Maximize,
  Home,
  MapPin,
  Heart,
  Scale,
  ShieldCheck,
  Building,
  ArrowRight,
  Layers,
  Calculator,
  BadgePercent,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onNavigate: (path: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
  isCompared: boolean;
  onToggleCompare: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}) => {
  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          alt: property.title,
        };

  // KPR estimation formula: 80% loan principal, 5.5% annual interest, 20 years (240 months)
  const loanPrincipal = property.price * 0.8;
  const monthlyRate = 0.055 / 12;
  const totalMonths = 240;
  const estimatedMonthlyKpr = Math.round(
    (loanPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths))
  );
  const dpAmount = property.price * 0.2;
  const hasFloorPlan = property.floorPlans && property.floorPlans.length > 0;

  const handleCardClick = () => {
    onNavigate(`/property/${property.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Lihat rincian ${property.title}`}
      className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      id={`property-card-${property.id}`}
    >
      {/* Media Figure */}
      <figure className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 m-0 shrink-0">
        <img
          src={primaryImage.url}
          alt={primaryImage.alt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-xs shadow-xs">
              {property.propertyTypeName}
            </span>
            {property.partner?.verified && (
              <span className="text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/90 text-white backdrop-blur-xs shadow-xs">
                <ShieldCheck className="w-3 h-3" />
                <span>Terverifikasi</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-xs shrink-0 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md scale-105'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600'
            }`}
            aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            title={isFavorite ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Figure Metadata */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium z-10">
          <span className="flex items-center gap-1 drop-shadow-sm truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">
              {property.location.district ? `${property.location.district}, ` : ''}{property.location.city}
            </span>
          </span>

          <span className="text-[11px] px-3 py-0.5 rounded-full bg-emerald-600/90 text-white font-bold backdrop-blur-xs shrink-0">
            {property.availability === 'AVAILABLE'
              ? 'Tersedia'
              : property.availability === 'LIMITED'
              ? 'Unit Terbatas'
              : 'Terjual'}
          </span>
        </div>
      </figure>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white space-y-3.5">
        <div className="space-y-3">
          {/* Project & Floor Plan Availability Tag */}
          <div className="flex items-center justify-between gap-2">
            {property.project ? (
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider truncate flex items-center gap-1">
                <Building className="w-3 h-3 shrink-0" />
                <span className="truncate">{property.project.name}</span>
              </p>
            ) : (
              <span className="text-[11px] font-semibold text-slate-600">
                Sertifikat {property.specification.certificate.split(' ')[0] || 'SHM'}
              </span>
            )}

            {hasFloorPlan && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full shrink-0 border border-indigo-100">
                <Layers className="w-3 h-3 text-indigo-600" />
                <span>Denah {property.specification.floors} Lt</span>
              </span>
            )}
          </div>

          {/* Title & Address */}
          <div>
            <h3
              className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug"
              title={property.title}
            >
              {property.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {property.location.address}
            </p>
          </div>

          {/* Specifications Grid */}
          <dl className="grid grid-cols-4 gap-1 py-2 px-1 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700">
            <div className="flex flex-col items-center justify-center p-1 text-center min-w-0">
              <dt className="sr-only">Kamar Tidur</dt>
              <dd className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Bed className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{property.specification.bedrooms} KT</span>
              </dd>
            </div>

            <div className="flex flex-col items-center justify-center p-1 text-center min-w-0 border-l border-slate-200/60">
              <dt className="sr-only">Kamar Mandi</dt>
              <dd className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Bath className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{property.specification.bathrooms} KM</span>
              </dd>
            </div>

            <div className="flex flex-col items-center justify-center p-1 text-center min-w-0 border-l border-slate-200/60">
              <dt className="sr-only">Luas Bangunan</dt>
              <dd className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Home className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{property.specification.buildingArea} m²</span>
              </dd>
            </div>

            <div className="flex flex-col items-center justify-center p-1 text-center min-w-0 border-l border-slate-200/60">
              <dt className="sr-only">Luas Tanah</dt>
              <dd className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Maximize className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{property.specification.landArea} m²</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Dedicated Clear Price & KPR Information Card (Never Truncated) */}
        <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 space-y-2">
          {/* Cash / Total Property Price */}
          <div>
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Harga Jual (Tunai / KPR)
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                All-in
              </span>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              {formatRupiah(property.price)}
            </div>
          </div>

          {/* KPR Monthly Installment & Details Box */}
          <div className="pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <Calculator className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Cicilan KPR:</span>
              </div>
              <span className="text-xs font-extrabold text-blue-700">
                ~{formatRupiah(estimatedMonthlyKpr, true)}<span className="text-[10px] font-semibold text-slate-500">/bln</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-1">
              <span>DP 20% ({formatRupiah(dpAmount, true)})</span>
              <span>Tenor 20 Thn · 5.5% p.a.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons in Dedicated Full-Width Row (Capsule Styled) */}
        <footer className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property.id);
            }}
            className={`flex-1 py-2 px-2.5 rounded-full border text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 ${
              isCompared
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title={isCompared ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'}
            aria-label="Bandingkan properti"
          >
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap text-[11px]">
              {isCompared ? 'Di Komparasi' : 'Bandingkan'}
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(`/property/${property.slug}`);
            }}
            className="flex-1 py-2 px-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </footer>
      </div>
    </article>
  );
};
