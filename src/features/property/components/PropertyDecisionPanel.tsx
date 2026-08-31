import React from 'react';
import { Property } from '../../../core/types/property.types';
import { formatRupiah } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/ui/Button';
import {
  Heart,
  Scale,
  Calculator,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from 'lucide-react';

interface PropertyDecisionPanelProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
  onNavigate: (path: string) => void;
}

export const PropertyDecisionPanel: React.FC<PropertyDecisionPanelProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onNavigate,
}) => {
  // 20 years, 20% DP, 5.5% interest
  const estimatedMonthlyKpr = Math.round(
    (property.price * 0.8 * (0.055 / 12)) / (1 - Math.pow(1 + 0.055 / 12, -240))
  );

  return (
    <aside className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-lg space-y-6 sticky top-20">
      {/* Price & KPR Badge */}
      <div className="space-y-1 pb-5 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Harga Penawaran Resmi
        </span>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {formatRupiah(property.price)}
        </div>
        <div className="pt-2 flex items-center justify-between bg-blue-50/80 px-3.5 py-2 rounded-full border border-blue-100">
          <div>
            <span className="text-[10px] font-medium text-slate-600 block">Estimasi Cicilan KPR</span>
            <span className="text-xs font-extrabold text-blue-700">
              ~{formatRupiah(estimatedMonthlyKpr, true)} / bulan
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(`/simulator/kpr?price=${property.price}`)}
            className="text-[11px] font-bold text-blue-700 underline hover:text-blue-800"
          >
            Simulasikan
          </button>
        </div>
      </div>

      {/* Decision CTA Buttons */}
      <div className="space-y-2.5">
        <Button
          variant="secondary"
          size="lg"
          className="w-full font-bold shadow-md"
          leftIcon={<Calculator className="w-5 h-5" />}
          onClick={() => onNavigate(`/simulator/kpr?price=${property.price}`)}
        >
          Hitung Simulasi KPR
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={isCompared ? 'secondary' : 'outline'}
            size="md"
            leftIcon={<Scale className="w-4 h-4" />}
            onClick={onToggleCompare}
            className={isCompared ? 'bg-blue-600' : ''}
          >
            {isCompared ? 'Tersimpan (Banding)' : 'Bandingkan'}
          </Button>

          <Button
            variant={isFavorite ? 'danger' : 'outline'}
            size="md"
            leftIcon={<Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />}
            onClick={onToggleFavorite}
          >
            {isFavorite ? 'Tersimpan' : 'Favorit'}
          </Button>
        </div>
      </div>

      {/* Verified Partner Developer Box */}
      {property.partner && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Developer / Pengembang
            </span>
            {property.partner.verified && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                Terverifikasi
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <img
              src={property.partner.logo}
              alt={property.partner.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {property.partner.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {property.partner.description}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            {property.partner.phone && (
              <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold">{property.partner.phone}</span>
              </div>
            )}
            {property.partner.email && (
              <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold truncate">{property.partner.email}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Safety & Guarantee Notes */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-1.5 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Jaminan Informasi Legalitas</span>
        </div>
        <p className="leading-relaxed">
          Semua dokumen kepemilikan, sertifikat (SHM/PPJB), dan izin konstruksi telah diverifikasi oleh tim legal platform.
        </p>
      </div>
    </aside>
  );
};
